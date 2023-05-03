const axios = require("axios").default;
const qs = require('qs');

// slugs
let MEDITATION = "meditation";
let SITUPS = "situps";
let PUSHUPS = "pushups";
let STRETCH = "stretch";
let RUN = "run";
let TRACKED = "tracked";
let WATER = "water";

function name_to_slug(name) {
  const d = new Map([
    ["pushup", PUSHUPS],
    ["situp", SITUPS],
    ["drink", WATER],
    ["stretched", STRETCH],
    ["stretches", STRETCH],
    ["stretching", STRETCH],
    ["running", RUN],
    ["ran", RUN],
    ["meditated", MEDITATION],
    ["meditate", MEDITATION],
  ]);
  return d.get(name) || name;
}

let DEFAULT_CHARGE_AMOUNT = 5; // default amount of dollars to charge

class Beeminder {
  constructor(username = process.env.BEE_username, auth_token = process.env.BEE_auth_token, debug = false) {
    this.username = username;
    this.auth_token = auth_token;
    this.baseURL = "https://www.beeminder.com/api/v1/";
    this.debug = debug;
    this.lastTrackDataPoint = null;
  }

  async getUser() {
    let endpoint = `users/${this.username}.json`;
    let params = { skinny: true };
    return this._call({ endpoint, params });
  }

  // Datapoints
  async get_datapoints(slug, count = 0, sort = "") {
    /* get [count] slug datapoints, possible sort
    sort is the attribute to sort by. could be id, updated_at, daystamp.
    returns [{'timestamp':unix_timestamp,'value', 'id', 'updated_at':unix_timestamp, 'daystamp':str}, {}, ...] */
    slug = name_to_slug(slug);
    const endpoint = `users/${this.username}/goals/${slug}/datapoints.json`;
    const params = {};
    if (count) {
      params["count"] = count;
    }
    if (sort) {
      params["sort"] = sort;
    }
    const datapoints = await this._call({ endpoint, params }); // list of datapoints
    // {'timestamp', 'value', 'comment', 'daystamp'}
    return datapoints;
  }

  async get_last_datapoint(slug) {
    /* returns last datapoint by update {'timestamp':unix_timestamp, 'value', 'id', 'updated_at':unix_timestamp, 'daystamp':str} */
    const datapoints = await this.get_datapoints(slug, 1, "updated_at");
    return datapoints[0];
  }

  async add_datapoint(slug, value, comment = null) {
    /* returns added datapoint={'timestamp':unix_timestamp, 'value', 'id', 'updated_at':unix_timestamp, 'daystamp':str}*/
    slug = name_to_slug(slug);
    const endpoint = `users/${this.username}/goals/${slug}/datapoints.json`;
    const data = { value: value };
    if (comment) data["comment"] = comment;
    const datapoint_dict = await this._call({ endpoint, data, method: "POST" });
    if (datapoint_dict)
      console.log(`add_datapoint(): added ${value} to ${slug}, dict=${datapoint_dict}`);
    else{
      console.log(`beeminder:add_datapoint() error`);
    }
    return datapoint_dict;
  }

  async update_datapoint(slug, datapoint_id, value){
        /* returns updated datapoint = {'timestamp':unix_timestamp, 'value', 'id', 'updated_at':unix_timestamp, 'daystamp':str} */
        slug = name_to_slug(slug)
        const endpoint = `users/${this.username}/goals/${slug}/datapoints/${datapoint_id}.json`
        const data = {'value': value}
        const datapoint_dict = await this._call({endpoint, data, method:'PUT'})
        console.log(`beeminder::update_datapoint(): updated ${value} at ${slug}`)
        return datapoint_dict;
  }

  async charge(note, amount = 0, dryrun = false) {
    const endpoint = "charges.json";
    if (!amount) amount = DEFAULT_CHARGE_AMOUNT;
    const data = { amount: amount, note: "note" };
    if (dryrun || this.debug || note == "break") {
      console.log(`!!! (not) charged ${amount}$ for {note}`);
      return "dryrun";
    } else {
      console.log(`!!! charged ${amount}$ for ${note}`);
      // charge = await this._call({endpoint, data, method: "POST"});
      return "error";
      // return charge;
    }
  }

  _checkReponse(url, resp) {
    if (resp.statusText.toLowerCase() !== "ok") {
      let errorMessage =
        `\nurl:${url}` +
        `\nresponse_status:${resp.status}` +
        `\nresponse_statusText:${resp.statusText}` +
        `\nresponse_headers: ${JSON.stringify(resp.headers)}` +
        `\nrequest_header: ${JSON.stringify(resp.req._header)}`;
      throw new Error(errorMessage);
    }
    return resp.data;
  }

  async _call({ endpoint = "", params = {}, data = null, method = "GET" } = {}) {
    const url = this.baseURL + endpoint;
    params["auth_token"] = this.auth_token;
    if (data) data['auth_token'] = this.auth_token;
    var options = {
      method: method,
      url: url,
      params: params,
      headers: { "content-type": "application/x-www-form-urlencoded" }
    };
    console.log(`calling _call, 
      ${options.method}, ${options.url}, ${options.params}`);
    if (method != "GET") {
      options['data'] = qs.stringify(data)
    }

    try {
      const resp = await axios.request(options);
      return this._checkReponse(url, resp);
    } catch (err) {
      // resp.data, resp.status,resp.statusText, resp.headers, resp.request
      return err;
    }
  }
}

async function main() {
  const bee = new Beeminder();
  const resp = await bee.get_last_datapoint("pushups");
  console.log(resp);
}
// console.log('aaaa');
// if (typeof require !== 'undefined' && require.main === module) {
//   console.log('aaaa');
//   require("dotenv").config();
//   main();
// }


module.exports = Beeminder;