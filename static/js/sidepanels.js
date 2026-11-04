/* tian side panels — 宽屏（≥1440px）时在主页两侧空白处放玻璃小面板：
 * 左栏上：博主小名片（头像 / 名字 / 简介 / 文章数 / 照片数）
 * 左栏下：访客欢迎卡片（访客自己的位置 / IP / 设备，多源兜底，国内外都能直连）
 * 右栏：本站导航（首页 / 文章 / 关于 / RSS）+ 今日日期
 * 只在主页（有 .moments-feed）注入；显隐与定位全部由 wide.css 的媒体查询控制，
 * 平板与手机端不会出现。导航想换成自己的外部链接，改下面 links 数组即可。 */
(function () {
    'use strict';

    if (!document.querySelector('.moments-feed')) return;
    if (document.querySelector('.side-stack')) return;

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    /* ---------- 左栏上：博主小名片 ---------- */
    var left = el('aside', 'side-panel');

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

    /* ---------- 左栏下：访客欢迎卡片 ---------- */
    var welcome = el('aside', 'side-panel');
    welcome.appendChild(el('div', 'sp-whello', '👋 欢迎你'));
    var wLoc = wRow(welcome, '位置', '定位中…');
    var wIp = wRow(welcome, 'IP', '查询中…');
    wRow(welcome, '设备', deviceText());

    function wRow(parent, k, v) {
        var row = el('div', 'sp-wrow');
        row.appendChild(el('span', 'sp-wk', k));
        var val = el('span', 'sp-wv', v);
        row.appendChild(val);
        parent.appendChild(row);
        return val;
    }

    function deviceText() {
        var ua = navigator.userAgent || '';
        var os = '未知系统';
        if (/iPhone/.test(ua)) os = 'iPhone';
        else if (/iPad/.test(ua)) os = 'iPad';
        else if (/Android/.test(ua)) os = 'Android';
        else if (/Windows NT/.test(ua)) os = 'Windows';
        else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
        else if (/Linux/.test(ua)) os = 'Linux';
        var br = '';
        if (/MicroMessenger/.test(ua)) br = '微信';
        else if (/QQ\//.test(ua)) br = 'QQ';
        else if (/Edg\//.test(ua)) br = 'Edge';
        else if (/Firefox\//.test(ua)) br = 'Firefox';
        else if (/Chrome\//.test(ua)) br = 'Chrome';
        else if (/Safari\//.test(ua)) br = 'Safari';
        var kind = /Mobile|iPhone|Android.*Mobile/.test(ua) ? '手机' : (/iPad|Tablet/.test(ua) ? '平板' : '电脑');
        return kind + ' · ' + os + (br ? ' · ' + br : '');
    }

    function countryZh(code, fallback) {
        try {
            if (code) {
                var name = new Intl.DisplayNames(['zh-CN'], { type: 'region' }).of(code.toUpperCase());
                if (name) return name;
            }
        } catch (e) { /* 老浏览器没有 Intl.DisplayNames 就用接口给的英文名 */ }
        return fallback || '';
    }

    function setGeo(ip, code, country, region, city) {
        var parts = [];
        var c = countryZh(code, country);
        if (c) parts.push(c);
        if (region && region !== c) parts.push(region);
        if (city && city !== region) parts.push(city);
        wLoc.textContent = parts.length ? parts.join(' · ') : '来自远方的朋友';
        if (ip) wIp.textContent = ip;
    }

    function fetchJson(url, ms) {
        var ctrl = new AbortController();
        var t = setTimeout(function () { ctrl.abort(); }, ms);
        return fetch(url, { signal: ctrl.signal }).then(function (r) {
            clearTimeout(t);
            if (!r.ok) throw new Error('bad status');
            return r.json();
        });
    }

    /* 多源兜底：均为 HTTPS 且允许跨域，国内与海外访客都能直连；
       哪个先成功用哪个，全失败就只显示设备信息。 */
    fetchJson('https://ipwho.is/', 3500).then(function (d) {
        if (!d || d.success === false || !d.ip) throw new Error('empty');
        setGeo(d.ip, d.country_code, d.country, d.region, d.city);
    }).catch(function () {
        return fetchJson('https://api.ip.sb/geoip', 3500).then(function (d) {
            if (!d || !d.ip) throw new Error('empty');
            setGeo(d.ip, d.country_code, d.country, d.region, d.city);
        });
    }).catch(function () {
        wLoc.textContent = '来自远方的朋友';
        wIp.textContent = '未获取到';
    });

    /* ---------- 右栏：本站导航 ---------- */
    var right = el('aside', 'side-panel');
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

    /* ---------- 组装两列 ---------- */
    var stackL = el('div', 'side-stack side-stack-left');
    stackL.appendChild(left);
    stackL.appendChild(welcome);
    var stackR = el('div', 'side-stack side-stack-right');
    stackR.appendChild(right);
    document.body.appendChild(stackL);
    document.body.appendChild(stackR);
})();
