/*!
 * FileInput Spanish (Latin American) Translations
 *
 * This file must be loaded after 'fileinput.js'. Patterns in braces '{}', or
 * any HTML markup tags in the messages must not be converted or translated.
 *
 * @see http://github.com/kartik-v/bootstrap-fileinput
 *
 * NOTE: this file must be saved in UTF-8 encoding.
 */
(function ($) {
    "use strict";
    $.fn.fileinput.locales.es = {
    		fileSingle: '单文件',
            filePlural: '多文件',
            browseLabel: '选择文件 &hellip;',
            removeLabel: '删除文件',
            removeTitle: '删除选中文件',
            cancelLabel: '取消',
            cancelTitle: '取消上传',
            uploadLabel: '上传',
            uploadTitle: '上传选中文件',
            msgSizeTooLarge: '文件 "{name}" (<b>{size} KB</b>) 已经超过最大的上传大小 <b>{maxSize} KB</b>. 请重新上传!',
            msgFilesTooLess: '文件数量不能大于 <b>{n}</b>！请重新上传 {files}！',
            msgFilesTooMany: '选中的文件数 <b>({n})</b> 已经超过了最大的上传文件数 <b>{m}</b>. 请重新上传!',
            msgFileNotFound: '文件 "{name}" 未找到!',
            msgFileSecured: '安全限制！阻止读取文件 "{name}".',
            msgFileNotReadable: '文件 "{name}" 不可读！.',
            msgFilePreviewAborted: '文件预览失败 "{name}".',
            msgFilePreviewError: '读取文件时发生了错误 ："{name}".',
            msgInvalidFileType: '无效的文件类型 "{name}". 仅对 "{types}" 文件支持.',
            msgInvalidFileExtension: '无效的扩展名 "{name}". 仅对 "{extensions}" 支持！',
            msgValidationError: '文件上传错误',
            msgLoading: '加载文件下标  {index} of {files} &hellip;',
            msgProgress: 'Loading file {index} of {files} - {name} - {percent}% 完成！.',
            msgSelected: '选中{n}个文件',
            msgFoldersNotAllowed: 'Drag & drop files only! {n} folder(s) dropped were skipped.',
            dropZoneTitle: '拖拽文件到这里...'
    };

    $.extend($.fn.fileinput.defaults, $.fn.fileinput.locales.es);
})(window.jQuery);
