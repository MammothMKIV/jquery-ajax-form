/*!
 * jQuery Ajax Form
 * https://github.com/MammothMKIV/jquery-ajax-form
 *
 * Copyright (c) 2016 Nikita Rogovoy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function($){
    $.ajaxForm = function(el, options){
        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("ajaxForm", base);

        base.page = 1;

        base.options = {};

        base.init = function(){
            if (base.$el.attr('method')) {
                base.options.method = base.$el.attr('method');
            }

            base.options = $.extend({}, $.ajaxForm.defaultOptions, options || {});

            base.$el.on('submit', function (e) {
                var $this = $(this),
                    $submitElement = $this.find(base.options.submitElementSelector),
                    data = $this.serializeArray(),
                    oldElementText = $submitElement.text();

                if ($this.hasClass(base.options.submitFormClass)) {
                    e.preventDefault();
                }

                $this.addClass(base.options.submitFormClass);
                $submitElement.addClass(base.options.submitElementClass);
                $submitElement.text(base.options.submitElementText);
                if (base.page) {
                    data.push({name: 'page', value: base.page});
                }

                $.ajax({
                    type: base.options.method,
                    url: $this.attr('action'),
                    data: data,
                    dataType: base.options.dataType,
                    success: base.options.success,
                    error: base.options.error,
                    complete: function (jqXHR, textStatus) {
                        $this.removeClass(base.options.submitFormClass);
                        $submitElement.removeClass(base.options.submitElementClass);
                        $submitElement.text(oldElementText);

                        base.options.complete(jqXHR, textStatus);
                    }
                });

                return false;
            });
        };

        base.paginate = function (page) {
            base.page = page;
            base.$el.submit();
            base.page = null;
        };

        base.init();
    };

    $.ajaxForm.defaultOptions = {
        success: function () {},
        error: function () {},
        complete: function () {},
        dataType: 'json',
        submitElementSelector: '[type="submit"]',
        submitElementClass: 'submitting',
        submitElementText: '',
        submitFormClass: 'submitting',
        beforeSubmit: null,
        method: 'POST'
    };

    $.fn.ajaxForm = function(options){
        return this.each(function(){
            (new $.ajaxForm(this, options));
        });
    };
})(jQuery);