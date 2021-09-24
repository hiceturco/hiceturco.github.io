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
const query2 = `query MyQuery {
  hic_et_nunc_token(where: {id: {_in: ["171108"]}}){
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
  }
}`
const query3 = `query MyQuery {
  hic_et_nunc_token(where: {id: {_in: ["196026","196181"]}}){
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
  }
}`

const bannedOBJKTS = [];
const bannedSBJKTS = ["tz1ZvTQv1BS7bjUkcXN8sQWyNmmvgY9ppZQy", "tz1dFVePa546aLxLEKWmW2Xf9UKwYcJnTn5J"];

var not_me = false;

var gte = "2020-05-20T00:00:00Z";
var lte = "2100-05-31T00:00:00Z";

function filterTag(getTag){
	urlParams.set("event", getTag);
    update_current_href();
	tags = getTag.toLowerCase();
	
	if (tags === "hiceturco"){
	gte = "2021-05-20T00:00:00Z";
	lte = "2021-05-31T00:00:00Z";
	document.getElementById("descTurco").innerHTML = "Hi! We are a group of Turkish NFT artists from various disciplines and styles. <br> We love hic et nunc, so we wanted to create a special event we like to call <b>#hiceturco</b> and share some of our latest works under this tag.<br> We hope this helps the <b>#hiceturco</b> community to get to know the Turkish NFT art scene and that you enjoy our works!";}
	else if (tags === "cen_magic")  {
	document.getElementById("descTurco").innerHTML = "Out of ideas or wanna nurture your creative thinking with challenges? We are launching our first-ever '1topic 1week' challenge, challengetnunc!<br> Starts every Monday and lasts till the end of the week.<br> Here is the first one to keep you busy! <b>*Magic*</b> <br>Swap by <b>19.07.2021 Friday</b> together with the hashtags <b>#challengetnunc #cen_magic</b> <br>No winners. Meet new artists and have fun.";
	gte = "2020-05-20T00:00:00Z";
    lte = "2100-05-30T00:00:00Z";
	}
	else if (tags === "cen_mask")  {
	document.getElementById("descTurco").innerHTML = "Out of ideas or wanna nurture your creative thinking with challenges? Welcome to our '1topic 1week' challenge, challengetnunc!<br>Here is the second topic to keep you busy! <b>*Mask*</b> <br>Swap by <b>23.07.2021 Friday</b> together with the hashtags <b>#challengetnunc #cen_mask</b> <br>No winners. Meet new artists and have fun.";
	gte = "2020-05-20T00:00:00Z";
    lte = "2100-05-30T00:00:00Z";
	}
		else if (tags === "cen_utopia_dystopia")  {
	document.getElementById("descTurco").innerHTML = "Out of ideas or wanna nurture your creative thinking with challenges? Welcome to our '1topic 1week' challenge, challengetnunc!<br>Here is the third topic to keep you busy! <b>*utopia/dystopia*</b> <br>Swap by <b>30.07.2021 Friday</b> together with the hashtags <b>#challengetnunc #cen_utopia_dystopia</b> <br>No winners. Meet new artists and have fun.";
	gte = "2020-05-20T00:00:00Z";
    lte = "2100-05-30T00:00:00Z";
	}
		else if (tags === "helpetnunc")  {
	tags = ["helpetnunc","#helpetnunc"];
	document.getElementById("descTurco").innerHTML = "Turkey is in flames. Our forests are burning, animals are dying and people are losing their homes. We the artists that brought you <b>#hiceturco</b> decided to do something about this.<br><br>This is why we are bringing you <b style='color: #f5555d'>#helpetnunc</b>. This will be a week long event where artworks of your favourite artists from Turkey will be available to collect at the official hic et turco account.<br><br>All the profits will go to those in need and will help to rebuild and regrow what was lost.<br>Come join us to help spread the word.";
	gte = "2020-05-20T00:00:00Z";
    lte = "2100-05-30T00:00:00Z";
	}
			else if (tags === "cen_reflection")  {
	document.getElementById("descTurco").innerHTML = "Out of ideas or wanna nurture your creative thinking with challenges? Welcome to our '1topic 1week' challenge, challengetnunc!<br>Here is the fourth topic to keep you busy! <b>*reflection*</b> <br>Swap by <b>27.08.2021 Friday</b> together with the hashtags <b>#challengetnunc #cen_reflection</b> <br>No winners. Meet new artists and have fun.";
	gte = "2020-05-20T00:00:00Z";
    lte = "2100-05-30T00:00:00Z";
	}
				else if (tags === "cen_dream")  {
	document.getElementById("descTurco").innerHTML = "Out of ideas or wanna nurture your creative thinking with challenges? Welcome to our '1topic 1week' challenge, challengetnunc!<br>Here is the fifth topic to keep you busy! <b>*dream*</b> <br>Swap by <b>10.09.2021 Friday</b> together with the hashtags <b>#challengetnunc #cen_dream</b> <br>No winners. Meet new artists and have fun.";
	gte = "2020-05-20T00:00:00Z";
    lte = "2100-05-30T00:00:00Z";
	}
					else if (tags === "hiceturco2")  {
	gte = "2021-09-23T00:00:00Z";
	lte = "2021-09-30T00:00:00Z";
	document.getElementById("descTurco").innerHTML = "Hi! We are a group of Turkish NFT artists from various disciplines and styles. <br> We love hic et nunc, so we wanted to create a special event we like to call <b>#hiceturco2</b> and share some of our latest works under this tag.<br> We hope this helps the <b>#hiceturco2</b> community to get to know the Turkish NFT art scene and that you enjoy our works!";}
	
	fetchOnSale();
}

async function fetch2(){
	

}

async function fetchOnSale() {
    

    $("#swap").html('');
    loading();
    loadArtists(true);
    var { errors, data } = await fetchGraphQL(query, "myQuery", { "tags": tags, "gte": gte, "lte": lte });
    if (errors) return showError(errors);
	
    window.collection_type = 'onsale';
    transactions = [];
	dubs = [];
    for (trade of data.hic_et_nunc_token_tag.concat()) {
        if (empty(trade.token.creator.name)) trade.token.creator.name = proper_value(window.artists[trade.token.creator.address]);
		if(trade.token.supply>0) {
			if(!bannedOBJKTS.includes(trade.token.id)&&!dubs.includes(trade.token.id)&&!bannedSBJKTS.includes(trade.token.creator.address))
		transactions.push(trade);
		dubs.push(trade.token.id);
	};
    };
	// manually added objkts
	if(tags === "cen_magic"){
	var { errors2, data } = await fetchGraphQL(query2);
    if (errors2) return showError(errors2);
	    
	    for (trade of data.hic_et_nunc_token.concat()) {
        if (empty(trade.creator.name)) trade.creator.name = proper_value(window.artists[trade.creator.address]);
		if(trade.supply>0) {
			if(!bannedOBJKTS.includes(trade.id))
		transactions.push(JSON.parse('{"token":'+JSON.stringify(trade)+'}'));}
    }}
		if(tags.includes("helpetnunc")){
	var { errors3, data } = await fetchGraphQL(query3);
    if (errors3) return showError(errors3);
	    
	    for (trade of data.hic_et_nunc_token.concat()) {
        if (empty(trade.creator.name)) trade.creator.name = proper_value(window.artists[trade.creator.address]);
		if(trade.supply>0) {
			if(!bannedOBJKTS.includes(trade.id))
		transactions.push(JSON.parse('{"token":'+JSON.stringify(trade)+'}'));}
    }}
	console.log(dubs);
	window.transactions = transactions;
    sortTrades('unsold');
}
