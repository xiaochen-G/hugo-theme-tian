/* tian side panels — 宽屏（≥1440px）时在主页两侧空白处放两块玻璃小面板：
 * 左：博主小名片（头像 / 名字 / 简介 / 文章数 / 照片数）
 * 右：本站导航（首页 / 文章 / 关于 / RSS）+ 今日日期
 * 只在主页（有 .moments-feed）注入；显隐与定位全部由 wide.css 的媒体查询控制，
 * 平板与手机端不会出现。导航想换成自己的外部链接，改下面 links 数组即可。 */
(function () {
    'use strict';

    if (!document.querySelector('.moments-feed')) return;
    if (document.querySelector('.side-panel')) return;

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    /* ---------- 左：博主小名片 ---------- */
    var left = el('aside', 'side-panel side-panel-left');

    var avatarSrc = '/images/avatar.jpg';
    var headerAvatar = document.querySelector('.header-avatar img');
    if (headerAvatar && headerAvatar.getAttribute('src')) avatarSrc = headerAvatar.getAttribute('src');
    var avatar = el('img', 'sp-avatar');
    avatar.src = avatarSrc;
    avatar.alt = '';
    left.appendChild(avatar);

    var nameEl = document.querySelector('.header-name');
    left.appendChild(el('div', 'sp-name', nameEl ? nameEl.textContent.trim() : ''));

    var sigEl = document.querySelector('.header-signature');
    if (sigEl && sigEl.textContent.trim()) {
        left.appendChild(el('div', 'sp-desc', sigEl.textContent.trim()));
    }

    var stats = el('div', 'sp-stats');
    var postCount = document.querySelectorAll('.moment-card').length;
    var photoCount = document.querySelectorAll('.moment-gallery img').length;
    [[postCount, '篇文章'], [photoCount, '张照片']].forEach(function (pair) {
        var cell = el('div');
        cell.appendChild(el('b', null, String(pair[0])));
        cell.appendChild(el('span', null, pair[1]));
        stats.appendChild(cell);
    });
    left.appendChild(stats);

    /* ---------- 右：本站导航 ---------- */
    var right = el('aside', 'side-panel side-panel-right');
    right.appendChild(el('div', 'sp-title', '本站导航'));

    var links = [
        ['ri-home-line', '首页', '/'],
        ['ri-article-line', '文章', '/posts/'],
        ['ri-user-line', '关于', '/about/'],
        ['ri-rss-line', 'RSS 订阅', '/index.xml']
    ];
    links.forEach(function (item) {
        var a = el('a', 'sp-link');
        a.href = item[2];
        var icon = el('i');
        icon.className = item[0];
        a.appendChild(icon);
        a.appendChild(el('span', null, item[1]));
        right.appendChild(a);
    });

    var today = new Date();
    var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    var dateText = today.getFullYear() + ' 年 ' + (today.getMonth() + 1) + ' 月 ' + today.getDate() + ' 日 · 星期' + weekdays[today.getDay()];
    right.appendChild(el('div', 'sp-date', dateText));

    document.body.appendChild(left);
    document.body.appendChild(right);
})();
