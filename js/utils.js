// definitions
var tags = ["hiceturco"];
var artists = {};
var retrieveArtists = {};
const HEN_PROTOCOL_V1 = 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9';
const HEN_PROTOCOL = 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn'
const BID_PROTOCOL = 'KT1FvqJwEDWb1Gwc55Jd1jjTHRVWbYKUUpyq';
const OLD_OBJKT_BID = 'KT1Dno3sQZwR5wUCWxzaohwuJwG3gX1VWj1Z'


const HEN_BURN = 'tz1burnburnburnburnburnburnburjAYjjX';
const HEN_FEE = 25;
const HEN_DECIMALS = 1000000;

const ipfs_img = [
    "https://cloudflare-ipfs.com/",
    "https://gateway.ipfs.io/",
    "https://ipfs.io/",
    "https://ipfs.infura.io/"
];
const ipfs_video = "https://ipfs.io/"
const internal_api = "https://app.nftbiker.com/"
    //const internal_api = "https://hec.test/"
const wallet_url = "https://www.hicetnunc.xyz/tz/";
const default_thumbnail = "QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const language = navigator.language || navigator.userLanguage;
const historyDateFormat = new Intl.DateTimeFormat(language, { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false });
const dateFormat = new Intl.DateTimeFormat(language, { month: 'numeric', day: 'numeric', year: 'numeric' });

const dateOptions = {
    month: 'numeric',
    day: 'numeric'
}
const hourOptions = {
    hour: 'numeric',
    minute: 'numeric'
};

const query_subjkts = `
query myQuery($name: String!) {
  hic_et_nunc_holder(where: { name: {_eq: $name}}) {
    address
    name
    metadata
  }
}
`

const query_objkt = `
query myQuery($token: [bigint!]) {
    hic_et_nunc_token(where: {id: { _in: $token }}) {
      id
      title
      supply
      royalties
      mime
      display_uri
      thumbnail_uri
      artifact_uri
      creator {
        address
        name
      }
    }
  }
`

Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

function shuffleArray(array) {
    var m = array.length,
        t, i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function update_current_href() {
    let refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({
        path: refresh
    }, '', refresh);
}

function proper_value(val) {
    if (empty(val)) return null;
    return val;
}

function shorten_wallet(tz, max) {
    try {
        if (empty(tz)) return '';
        if (tz.match(/^(tz|kt)/im)) return tz.slice(0, 5) + ".." + tz.slice(-5);
        else return tz.slice(0, empty(max) ? 20 : max);
    } catch (e) {
        console.log("short wallet error", tz, e)
        return tz;
    }
}

async function normalizeBidData(asks, filled, bids, add_token) {
    let objkts = []
    if (add_token) {
        if (add_token === true) {
            // we retrieve objk for asks
            let list_ids = []
            if (!empty(asks) && asks.length > 0)
                for (ask of asks) list_ids.push(ask.objkt_id)
            if (!empty(filled) && filled.length > 0)
                for (fill of filled) list_ids.push(fill.objkt_id)
            if (!empty(bids) && bids.length > 0)
                for (bid of bids) list_ids.push(bid.objkt_id)

            objkts = await getObjkts([...new Set(list_ids)]);

        } else {
            for (t of add_token) {
                let c = Object.assign({}, t)
                if (typeof c.token_holders !== 'undefined') delete(c.token_holders)
                if (typeof c.trades !== 'undefined') delete(c.trades)
                objkts.push(c)
            }
        }
    }

    if (empty(asks)) asks = []
    else {
        for (item of asks) {
            item.platform = 'bid'
            item.token_id = item.objkt_id
            item.token = objkts.find(token => token.id == item.objkt_id);
            item.swap = { id: item.id, price: item.price }
            item.status = item.status == 'completed' ? 1 : 0
            if (!empty(item.token)) item.token.royalties = item.royalties;
        }
    }
    if (empty(filled)) filled = []
    else {
        for (item of filled) {
            item.platform = 'bid'
            item.token_id = item.objkt_id
            item.token = objkts.find(token => token.id == item.objkt_id);
            item.swap = { price: item.ask.price }
            item.status = 1
        }
    }
    if (empty(bids)) bids = []
    else {
        for (item of bids) {
            item.platform = 'bid'
            item.token_id = item.objkt_id
            item.token = objkts.find(token => token.id == item.objkt_id);
            item.buyer = Object.assign({}, item.creator)
            delete(item.creator)
            item.swap = { price: item.price }
            item.status = 1
            item.amount = 1
        }
    }

    return { asks: asks, filled: filled, bids: bids }
}

function empty(val) {
    if (typeof(val) == 'undefined') return true;
    else if (val == null) return true;
    else if (String(val).trim().length == 0) return true;
    else if (val == 'undefined' || val == 'null') return true;
    return false;
}


function normalized_operation(op) {
    if (op == 'ask' || op == 'fulfill_ask' || op == 'bid') return 'bid'
    else return 'hen'
}

function operation_link(id, title, op) {
    if (empty(title)) title = `#${id}`;
    if (normalized_operation(op) == 'bid') return bid_link(id, title)
    else return objkt_link(id, title);
}

function bid_link(id, title) {
    if (empty(title)) title = 'Bid';
    return `<a href="https://www.objkt.bid/o/${id}" target="_blank">${title}</a>`
}

function objkt_link(id, title) {
    if (empty(title)) title = `#${id}`;
    return `<a href="https://hicetnunc.xyz/objkt/${id}" target="_blank">${title}</a>`
}

function user_link(name, tz, op) {
    if (normalized_operation(op) == 'bid') {
        return `<a href="https://objkt.bid/profile/${tz}" target="_blank">${shorten_wallet(name)}</a>`;
    } else {
        return `<a href="https://www.hicetnunc.xyz/tz/${tz}" target="_blank">${shorten_wallet(name)}</a>`;
    }
}

function artist_bookmarklet(title, url) {
    txt = `
    javascript:(function() {
        m = window.location.href.match(/(hicetnunc.xyz\\\/tz|objkt.bid\\\/profile)\\\/(tz[^\\\/]+)/im);
        if (m) { window.open('${url}?wallet=' + m[2]); return false };
        m = document.body.innerHTML.match(/profile\\\/(tz[0-9a-z]{30,})/im);
        if (m) { window.open('${url}?wallet=' + m[1]); return false };
        m = document.body.innerHTML.match(/\\\/(tz[0-9a-z]{30,}).+?editions/im);
        if (m) { window.open('${url}?wallet=' + m[1]); return false };
        m = window.location.href.match(/hicetnunc.xyz\\\/([^\\\/]+)($|\\\/crea|\\\/coll)/im);
        if (m) { window.open('${url}?wallet=' + m[1]); return false };
        m = document.body.innerHTML.match(/href\\\=.*?\\\/([^\\\\(\\)\\?\\\/%22%27]+)[%22%27]/im);
        if (m) { window.open('${url}?wallet=' + m[1]); return false };
    })()
    `
    txt = txt.replace(/[\r\n\s]+/img, '');
    $('#bookmarklet').html(`
        Drag & Drop this <a href="${txt}" title="${title}">${title}</a> link on your bookmarks toolbar to access to this page from HEN artist or objkt page.
    `)
}

async function buildMenu(wallet) {
    let links = []
    if (empty(wallet)) wallet = '';
    links.push({ title: 'Artworks', href: '/artist' })
    links.push({ title: 'Royalties', href: '/royalties' })
    links.push({ title: 'Gifted', href: '/gifted' })
    links.push({ title: 'Flex', href: '/flex' })
    links.push({ title: 'Buy/Sale', href: '/activity' })
    txt = []
    for (link of links) txt.push(`<a href="${link.href}?wallet=${wallet}">${link.title}</a>`);
    $('#menu').remove();
    $('#wrapper').prepend(`<div id='menu'>${txt.join(" ")}</div>`);
}

function loading(keep_result) {
    $("#loading").show();
    $("#errors").hide();
    $("#result").hide();
    $('#collector').hide();
    if (!keep_result) $("#result").html("");
}

function showError(errors) {
    console.log(errors);
    let error = errors[0]
    $('#error').html(`ERROR : Unable to load data from API - ${error.message}`);
    $('#error').show();
    $('#loading').hide();
    return;
}

function formattedDate(date, type) {
    if (empty(date)) return null;
    if (type == 'date') return dateFormat.format(date);
    return historyDateFormat.format(date);
}

function wallet_link(data) {
    if (empty(data)) return '';
    let name = data.name;
    if (empty(name)) name = shorten_wallet(data.address);
    return `<a href="https://hicetnunc.xyz/tz/${data.address}" target="_blank">${name}</a>`
}

function asset_host(str, hostsArray) {
    // retrieve a random host, but always the same one for an str
    result = 0;
    for (var i = 0; i < str.length; i++) {
        result += str.charCodeAt(i);
    }
    host = hostsArray[result % hostsArray.length];
    return host;
}

function holders_info(data, include_burn) {
    let holders = {};
    for (h of data) {
        if ((h.holder.address == HEN_BURN) && !include_burn) continue;
        if (h.quantity == 0) continue;

        if (h.holder.address == HEN_PROTOCOL_V1) h.name = 'HEN V1'
        else if (h.holder.address == HEN_PROTOCOL) h.name = 'HEN Contract'
        else if (h.holder.address == BID_PROTOCOL) h.name = 'Objkt.bid'
        holders[h.holder.address] = {
            quantity: h.quantity,
            name: h.name
        };
    }
    return holders;
}

function artwork_url(uri, mime) {
    if (empty(mime)) mime = '';
    if (mime.match(/video/)) host = ipfs_video;
    else host = asset_host(uri, ipfs_img);
    if (!host.match(/\/$/)) host += '/';
    return uri.replace('ipfs://', host + 'ipfs/');
}

function get_artwork_link(obj) {
    let artwork_link = obj.mime;
    if (!empty(obj.mime) && obj.mime.match(/image|video/)) {
        artwork_link = empty(obj.display_uri) ? obj.artifact_uri : obj.display_uri;
        artwork_link = artwork_url(artwork_link, obj.mime);
        artwork_link = `<a href="${artwork_link}" target="_blank">${obj.mime}</a>`;
    }
    return artwork_link;
}

function isTezosDomain(address) {
    return /\.tez$/.test(address);
}

async function resolveTezosDomain(domain) {
    try {
        const result = await fetch('https://api.tezos.domains/graphql', {
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({
                query: 'query resolveDomain($domain: String!) {\n  domain(name: $domain) {\n    address\n  }\n}\n',
                variables: { domain },
                operationName: 'resolveDomain',
            }),
        });

        const response = await result.json();
        return response.data.domain.address || '';
    } catch (err) {
        return '';
    }
}

async function getSubjkt(name) {
    const { errors, data } = await fetchGraphQL(query_subjkts, 'myQuery', { "name": name });
    if (errors) {
        console.error(errors)
    }
    let result = data.hic_et_nunc_holder[0];
    if (empty(result)) return name;
    if (!empty(result.address)) return result.address;
    else return name;
}

async function getObjkt(id) {
    let result = await getObjkts([id]);
    if (empty(result)) return {};
    else return result[0];
}

async function getObjkts(list) {
    const { errors, data } = await fetchGraphQL(query_objkt, 'myQuery', { "token": list });
    if (errors) console.error(errors)
    let result = data.hic_et_nunc_token;
    if (empty(result)) return [];
    else return result;
}


async function getAddress(addressOrDomain) {
    if (empty(addressOrDomain)) return '';
    if (isTezosDomain(addressOrDomain)) {
        const address = await resolveTezosDomain(addressOrDomain);
        if (address) return address;
    }
    m = addressOrDomain.match(/(tz[^\.\/\'\"]{30,})/im);
    if (m) return m[1];
    val = addressOrDomain.split('/').pop()
    return await getSubjkt(val);
}

/* Wallet meta infos */
async function getWalletName(wallet, raw) {
    if (wallet == HEN_PROTOCOL || wallet == HEN_PROTOCOL_V1 || wallet == BID_PROTOCOL) return 'unknown';
    else wallet = await getAddress(wallet);
    let data = await apiAsyncRequest(`https://api.tzkt.io/v1/accounts/${wallet}/metadata`);
    if (empty(data)) data = { address: wallet };
    else data.address = wallet;

    let name = wallet;
    if (!empty(data['alias'])) name = data['alias']
    else if (!empty(data['twitter'])) name = data['twitter']
    if (raw) {
        data.name_or_wallet = shorten_wallet(name);
        return data
    } else return shorten_wallet(name);
}

function getArtistName(wallet) {
    let artist_name = window.artists[wallet];
    if (!empty(artist_name)) return artist_name;
    if (wallet == HEN_PROTOCOL || wallet == HEN_PROTOCOL_V1 || wallet == BID_PROTOCOL) return 'unknown';

    getAuthorMetadata(wallet).then((data) => {
        artist_name = proper_value(data.name) || wallet;
        window.artists[wallet] = artist_name;
        return artist_name;
    });
}

async function getAuthorMetadata(wallet) {
    const data = await apiAsyncRequest(internal_api + "artists/" + wallet + ".json");
    if (!empty(data)) return data;
    else return {
        name: null,
        address: null,
        twitter: null,
    };
}

function getOrFindArtist(wallet, retrieve) {
    if (window.artists[wallet]) return window.artists[wallet];
    else if (retrieve) {
        retrieveArtists[wallet] = true;
        return null;
    } else if (retrieveArtists[wallet] && retrieveArtists[wallet] != true) return shorten_wallet(retrieveArtists[wallet]);
    else return shorten_wallet(wallet);
}

async function retrieveArtistsNotFound() {
    if (empty(window.artistsNotFound)) return;
    else if (window.artistsNotFound.length == 0) return;
    $.each(window.artistsNotFound, function(idx, wallet) {
        getWalletName(wallet, true).then((data) => {
            $(`a[data-artist|=${wallet}]`).html(shorten_wallet(data.name_or_wallet));
            data['address'] = wallet;
            // update our db to cache artist info
            $.ajax({
                url: internal_api + "artists",
                type: 'POST',
                data: { wallet: data },
                dataType: "json"
            });
        });
    });
}

async function findMissingArtists(list) {
    if (list.length == 0) return {};
    data = $.ajax({
        url: internal_api + "artists.json",
        type: 'POST',
        data: { wallets: list },
        async: false,
        dataType: "json"
    }).responseJSON;
    if (!empty(data)) {
        window.artistsNotFound = data.not_found;
        return data.found;
    } else return {};
}

/* API */
async function apiAsyncRequest(url) {
    let result;
    try {
        result = await $.ajax({
            url: url,
            type: 'GET',
            cache: true,
            dataType: 'json'
        });
        return result;
    } catch (error) {
        console.log(`Api request error for ${url}`, error);
        return {};
    }
}

function apiSyncRequest(url) {
    try {
        data = $.ajax({
            url: url,
            type: 'GET',
            cache: true,
            async: false,
            dataType: "json"
        }).responseJSON;
        return data;
    } catch (e) {
        console.log(`Api request error for ${url}`, error);
    }
}

function sql_date(date) {
    return date.toISOString().split('.')[0];
}

async function fetchGraphQL(operationsDoc, operationName, variables, cache) {
    let url = cache ? internal_api + 'graphql.json' : "https://api.hicdex.com/v1/graphql"
    const result = await fetch(
        url, {
            method: "POST",
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName
            })
        }
    );

    return await result.json();
}

function preview(obj) {
    val = null;
    format = 'img';
    if (!empty(obj)) {
        if (!empty(obj.artifact_uri)) {
            val = obj.artifact_uri;
            if (obj.mime.match(/video/i) && !empty(val)) format = 'video';
            else if (!obj.mime.match(/image/i)) val = obj.display_uri;
        }
        if (empty(val)) val = obj.thumbnail_uri;
    }
    if (empty(val)) val = "ipfs://" + default_thumbnail;

    host = format == 'video' ? ipfs_video : asset_host(val, ipfs_img);
    if (!host.match(/\/$/)) host += '/';
    val = val.replace('ipfs://', host + 'ipfs/');
    if (format == 'video') return "<video data-src='" + val +
        "' class='lozad media' type='video/mp4' muted autoplay loop></video>";
    else return "<img data-src='" + val + "' class='lozad media'/>";
}


/* ****************** */
/* artists management */
/* ****************** */
function uniqueArrayByKey(data, key) {
    var result = data.reduce((current, next) => {
        if (!current.some(a => a[key] === next[key])) {
            current.push(next);
        }
        return current;
    }, []);
    return result;
}

function loadArtists(storage_only, update) {
    let content = storage_only ? null : $('#wallets').val();
    if (empty(content) && storage_only) content = localStorage.getItem("wallets");
    if (empty(content) && !empty(update) && update) localStorage.removeItem("wallets");
    if (empty(content)) return;

    let list = []
    let wallets = []

    $.each([...new Set(content.replace(/^\s+/g, '').replace(/\s+$/g, '').split(/\r?\n/))], function(idx, line) {
        line = line.replace(/\s+/g, ' ').replace(/^\s+/g, '').replace(/\s+$/g, '');
        if (line.match(/^tz.+/im)) line = wallet_url + line;

        adr = line.split(" ").shift().split('/').pop();
        if (adr != '' && adr.match(/^tz.{32}/im)) wallets.push(adr);

        let name = '';
        data = line.split("#");
        if (data.length > 1) {
            name = data.pop().replace(/^\s+/g, '').replace(/\s+$/g, '');
            window.artists[adr] = name;
        } else if (window.artists[adr] && adr != window.artists[adr]) {
            name = window.artists[adr];
        }
        line = wallet_url + adr;
        if (name != '') line += " # " + name;
        list.push({
            address: adr,
            name: name,
            line: line
        });
    });

    list = list.sort(function(a, b) {
        return a['name'].localeCompare(b['name']);
    });
    list = uniqueArrayByKey(list, 'address');

    content = $.map(list, function(v) {
        return v.address + " # " + v.name;
    }).join("\n");
    localStorage.setItem("wallets", content);

    content = $.map(list, function(v) {
        return v.line;
    }).join("\n");

    window.wallets = wallets;
    $('#wallets').val(content);
}

// dark mode
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
$(document).ready(function() {
    // Check for dark mode preference at the OS level
    let currentTheme = localStorage.getItem("theme");
    if (empty(currentTheme)) {
        if (prefersDarkScheme.matches) currentTheme = "dark";
        else currentTheme = "white";
    }

    if (currentTheme == "dark") {
        $("body").addClass("dark");
    } else {
        $("body").removeClass("dark");
    }

    // Listen for a click on the button
    $("#theme").on("click", function() {
        let theme = '';
        if ($('body').hasClass('dark')) {
            $('body').removeClass("dark");
            theme = 'white';
        } else {
            $('body').addClass("dark");
            theme = 'dark';
        }
        localStorage.setItem("theme", theme);
    });
});