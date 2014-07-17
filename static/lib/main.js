"use strict";
/*global RELATIVE_PATH, app, utils*/

function adjustSubMenu() {
	if ($(document).scrollTop() > 90) {
		$('.sub-header').addClass('fixed');
		$('body').addClass('subHeader-fixed');
	} else {
		$('.sub-header').removeClass('fixed');
		$('body').removeClass('subHeader-fixed');
	}
}

$(document).ready(function () {
    $(window).on('action:ajaxify.contentLoaded', function(err, data) {
    	var url = data.url,
    		menuItem;

    	if (url === '') {
    		menuItem = 'feed';
    	} else if (url.match(/^recent/)) {
    		menuItem = 'recent';
    	} else if (url.match(/^popular/)) {
    		menuItem = 'popular';
    	}

    	$('.main-menu li').removeClass('active');
    	$('.main-menu .menu-' + menuItem).addClass('active');

    	$(document).on('scroll', adjustSubMenu);
    	adjustSubMenu();


        buildBreadcrumbs(data.url);
        enableNewPostButton(data.url);
    });
});

function enableNewPostButton(url) {
    if (url === '') {
        $('#category-menu').attr('data-toggle', 'dropdown');
        var menuItem = '<li role="presentation"><a role="menuitem" tabindex="-1" href="{slug}">{title} <!-- IF unread --><span class="label label-danger">New</span><!-- ENDIF unread --><br /><small>{description}</small></a></li>';

        $('#category-menu-list').html('');
        var html = '';
        
        $('.card-content h2 a').each(function() {
            var $this = $(this);

            html += templates.parse(menuItem, {
                slug: $this.attr('href'),
                title: $this.text(),
                description: $this.children('input[name="description"]').val(),
                unread: !!$this.children('input[name="unread"]').val()
            });
        });

        $('#category-menu-list').html(html);       
    } else {
        $('#category-menu').removeAttr('data-toggle');
    }
}

function buildBreadcrumbs(url) {
    var breadcrumb = '<a href="{path}" class="btn btn-default btn-breadcrumb-page">{title}</a>';
    $('.btn-breadcrumb-page').remove();

    var obj;

    if (url.match(/^category/)) {
        obj = {
            title: ajaxify.variables.get('category_name'),
            path: ajaxify.variables.get('category_slug')
        };
    }


    if (obj) {
        $('.btn-breadcrumb #btn-home').after(templates.parse(breadcrumb, obj));
    }
}