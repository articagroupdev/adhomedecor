/* global jQuery, aydTranslate */
jQuery(function ($) {
    'use strict';

    const DELAY_MS = 2500; // 2.5s between requests → 24 RPM (safe under Groq's 30 RPM limit)

    let running = false;
    let stop    = false;

    const $btnPending = $('#ayd-btn-pending');
    const $btnAll     = $('#ayd-btn-all');
    const $btnStop    = $('#ayd-btn-stop');
    const $wrap       = $('#ayd-progress-wrap');
    const $bar        = $('#ayd-bar');
    const $text       = $('#ayd-progress-text');
    const $log        = $('#ayd-log');

    $btnPending.on('click', function () {
        if (!confirm('¿Traducir todos los productos sin descripción en inglés?')) return;
        startBatch(false);
    });

    $btnAll.on('click', function () {
        if (!confirm('¿Retraducir TODOS los productos? Se sobreescribirán las traducciones existentes.')) return;
        startBatch(true);
    });

    $btnStop.on('click', function () {
        stop = true;
        $btnStop.prop('disabled', true).text('Deteniendo…');
    });

    function startBatch(overwrite) {
        running = true;
        stop    = false;

        $btnPending.prop('disabled', true);
        $btnAll.prop('disabled', true);
        $btnStop.show().prop('disabled', false).text('Detener');
        $wrap.show();
        $log.show().empty();

        setProgress(0, 'Iniciando…');
        addLog('▶ Iniciando — 1 producto cada 4s (límite free tier Gemini)', 'info');

        runNext(0, overwrite);
    }

    function runNext(offset, overwrite) {
        if (stop) {
            addLog('⏹ Detenido por el usuario.', 'warn');
            endBatch();
            return;
        }

        $.post(aydTranslate.ajaxUrl, {
            action:    'ayd_translate_batch',
            nonce:     aydTranslate.nonce,
            offset:    offset,
            overwrite: overwrite ? '1' : '0',
        })
        .done(function (res) {
            if (!res.success) {
                addLog('✗ Error: ' + (res.data || 'desconocido'), 'error');
                endBatch();
                return;
            }

            const d = res.data;

            // Single result to log
            if (d.result) {
                const r    = d.result;
                const icon = r.status === 'success' ? '✓' : r.status === 'skip' ? '—' : '✗';
                addLog(icon + ' ' + r.name + ' — ' + r.message, r.status);
            }

            // Finished
            if (d.done) {
                setProgress(100, d.message || 'Completado.');
                addLog('✓ ' + (d.message || 'Traducción finalizada.'), 'success');
                endBatch();
                return;
            }

            // Update progress using real translated count
            if (d.total > 0) {
                const remaining = d.total;
                const pct       = d.translated !== undefined
                    ? Math.min(Math.round((d.translated / (d.translated + remaining)) * 100), 100)
                    : 0;
                setProgress(pct, (d.translated || '?') + ' traducidos · ' + remaining + ' pendientes');
            }

            // Wait signal (quota or server error)
            if (d.wait) {
                countdown(d.wait, d.wait_reason || 'Esperando…', overwrite, d.next_offset, d.total, d.translated);
                return;
            }

            // Continue after delay
            setTimeout(function () {
                runNext(d.next_offset, overwrite);
            }, DELAY_MS);
        })
        .fail(function () {
            addLog('✗ Error de conexión. Reintentando en 10s…', 'error');
            setTimeout(function () { runNext(offset, overwrite); }, 10000);
        });
    }

    function countdown(seconds, reason, overwrite, nextOffset, total, translated) {
        let remaining = seconds;
        addLog('⏳ ' + reason, 'warn');

        const timer = setInterval(function () {
            if (stop) {
                clearInterval(timer);
                addLog('⏹ Detenido durante espera.', 'warn');
                endBatch();
                return;
            }
            remaining--;
            setProgress(
                total > 0 && translated !== undefined
                    ? Math.round((translated / (translated + total)) * 100)
                    : 0,
                'Esperando ' + remaining + 's…'
            );
            if (remaining <= 0) {
                clearInterval(timer);
                addLog('▶ Continuando…', 'info');
                runNext(nextOffset, overwrite);
            }
        }, 1000);
    }

    function endBatch() {
        running = false;
        $btnPending.prop('disabled', false);
        $btnAll.prop('disabled', false);
        $btnStop.hide();
    }

    function setProgress(pct, label) {
        $bar.css('width', pct + '%');
        $text.text(label);
    }

    function addLog(msg, type) {
        const colors = { success: '#00a32a', error: '#d63638', skip: '#999', warn: '#dba617', info: '#2271b1' };
        $log.append($('<div>').css({ color: colors[type] || '#333', padding: '1px 0' }).text(msg));
        $log.scrollTop($log[0].scrollHeight);
    }
});
