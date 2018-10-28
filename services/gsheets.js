const Promise = require("promise");
const { google } = require("googleapis");
const credentials = require("../credentials");

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

class GSheets {

  /**
   * Creates an oAuth2 client for the given credentials.
   * @return {Promise} A promise to return the auth client.
   */
  async authorize() {
    const jwtClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: scopes
    });
    return new Promise((resolve, reject) => {
      jwtClient.authorize((error, tokens) => { // eslint-disable-line no-unused-vars
        if (error) {
          reject(error);
        } else {
          google.options({
            auth: jwtClient
          });
          resolve(jwtClient);
        }
      });
    });
  }

  /**
   * Fetches the data for a given spreadsheet.
   * @param {string} spreadsheetId The ID of the spreadsheet to gather data from.
   * @param {string} cellRange The A1:B1 form cell range to query for.
   * @return {Promise} A promise to return the Google API service.
   */
  async getValues(spreadsheetId, cellRange) {
    await this.authorize();
    const sheets = google.sheets({version: "v4"});
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: cellRange,
        valueRenderOption: "UNFORMATTED_VALUE",
      }, (err, res) => {
        if (err) reject(err);
        return resolve(res.data.values);
      });
    });
  }

  async insertRow(spreadsheetId, cellRange, values) {
    const resource = { values };
    await this.authorize();
    const sheets = google.sheets({version: "v4"});
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: cellRange,
        valueInputOption: "RAW",
        insertDataOption: "OVERWRITE",
        resource: resource
      }, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = GSheets;