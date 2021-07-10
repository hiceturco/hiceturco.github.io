const query = `
query myQuery($tags: [String!],$gte: timestamptz!, $lte: timestamptz!) {
  hic_et_nunc_token_tag(where: {tag: {tag: {_in: $tags}}, token: {timestamp: {_gte: $gte, _lte: $lte}}}) {
      token {
      id
      title
      supply
      mime
      thumbnail_uri
      display_uri
      artifact_uri
      royalties
      creator {
        address
        name
      }
trades_aggregate {
        aggregate {
          count
        }
      }
 }}}

`

const bannedOBJKTS = [];

var not_me = false;

var gte = "2020-05-20T00:00:00Z";
var lte = "2100-05-31T00:00:00Z";

function filterTag(getTag){
	urlParams.set("event", getTag);
    update_current_href();
	tags = getTag;
	
	if (getTag === "hiceturco"){
	gte = "2021-05-20T00:00:00Z";
	lte = "2021-05-31T00:00:00Z";}
	else {
	gte = "2020-05-20T00:00:00Z";
    lte = "2100-05-30T00:00:00Z";
	}
	
	fetchOnSale();
}

async function fetchOnSale() {
    

    $("#swap").html('');
    loading();
    loadArtists(true);
    const { errors, data } = await fetchGraphQL(query, "myQuery", { "tags": tags, "gte": gte, "lte": lte });
    if (errors) return showError(errors);

    window.collection_type = 'onsale';
    transactions = []
    for (trade of data.hic_et_nunc_token_tag.concat()) {
		trade.price = (trade.price / HEN_DECIMALS).round(2)
        if (empty(trade.token.creator.name)) trade.token.creator.name = proper_value(window.artists[trade.token.creator.address]);
		if(trade.token.supply>0) {
			if(!bannedOBJKTS.includes(trade.token.id))
		transactions.push(trade);};
    };

    window.transactions = transactions;
    sortTrades('unsold');
}
/*
async function showProfile() {
    if (not_me) return;
    $("#profile").html(`
    <div class="profile">
        <div class="icon">
            <img src="https://services.tzkt.io/v1/avatars2/tz1hvfkpf7HbnE1Rroi7JbyegVjZzu97Yqw6" alt="identicon"></div>
        <div class="bio">
            <p><strong>NftBiker</strong></p>
            <p>Biker // Geek // Collectionneur de NFTs</p>
            <a href="https://www.hicetnunc.xyz/tz/tz1hvfkpf7HbnE1Rroi7JbyegVjZzu97Yqw6" target="_blank">tz1hv...7Yqw6</a>
            <div class='social'><a href="https://nftbiker.com" target="_blank" rel="noopener noreferrer" class="styles_container__2e6-S"><span class="link_text">https://nftbiker.com</span><svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
        style="fill: var(--text-color); stroke: transparent; margin-right: 10px;">
        <path
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z">
        </path>
      </svg></a><a href="https://twitter.com/nftbiker" target="_blank" rel="noopener noreferrer" class="styles_container__2e6-S"><span class="link_text">https://twitter.com/nftbiker</span><svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
        style="fill: var(--text-color); stroke: transparent; margin-right: 10px;">
        <path
          d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z">
        </path>
      </svg></a><a href="https://instagram.com/nftbiker" target="_blank" rel="noopener noreferrer" class="styles_container__2e6-S"><span class="link_text">https://instagram.com/nftbiker</span><svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
        style="fill: var(--text-color); stroke: transparent; margin-right: 10px;">
        <path
          d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z">
        </path>
      </svg></a><a href="https://github.com/nftbiker" target="_blank" rel="noopener noreferrer" class="styles_container__2e6-S"><span class="link_text">https://github.com/nftbiker</span><svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
        style="fill: var(--text-color); stroke: transparent; margin-right: 10px;">
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z">
        </path>
      </svg></a></div>
        </div>
    </div>
`)
}

async function showInfos() {
    if (not_me) return;

    $("#infos").html(`
  <h3>ARTWORKS I'VE COLLECTED ON HICETNUNC THAT I'M READY TO SELL</h3>
  <p>
      Feel free to <a href="https://twitter.com/messages/compose?recipient_id=1368585291821424644" target="_blank">DM
me on twitter</a> for any question. You just have to click on an artwork to go to the official selling page on HEN. This gallery is <b>automatically updated</b> when new artwork is available or sold.
      <b>Each sale funds me to discover more artists and reinvest in other artworks, because collecting is a
disease that I have since childhood :-)</b>
  </p>
  `)
}*/