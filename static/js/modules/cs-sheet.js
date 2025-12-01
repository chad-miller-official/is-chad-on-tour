import { css, html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js'

export class DayBlock extends LitElement {
  static get styles() {
    return css`
      col {
        width: 9ch;
      }

      table {
        border: 1px solid black;
        border-collapse: collapse;
        width: max-content;
      }

      td {
        border: 1px solid black;
        max-width: 9ch;
        overflow: hidden;
        padding: 2px;
        text-wrap-mode: nowrap;
      }

      td[contenteditable] {
        font-family: "Caveat", cursive;
      }

      thead > tr:first-of-type {
        border: 2px solid black;
      }

      thead > tr:first-of-type > td {
        border-left: none;
        border-right: none;
      }

      /* Black & White theme */

      .bw-field, .bw-day, .bw-header, .bw-footer {
        background-color: white;
      }

      /* Classic 1 theme */

      .classic1-field {
        background-color: #c9f4d9;
      }

      .classic1-day {
        background-color: #fce43a;
      }

      .classic1-header {
        background-color: #fad445;
      }

      .classic1-footer {
        background-color: #cdf4f3;
      }

      /* Classic 2 theme */

      .classic2-field {
        background-color: #fce43a;
      }

      .classic2-day {
        background-color: #c9f4d9;
      }

      .classic2-header {
        background-color: #fad445;
      }

      .classic2-footer {
        background-color: #cdf4f3;
      }

      /* Classic 3 theme */

      .classic3-field {
        background-color: #c9f4d9;
      }

      .classic3-day {
        background-color: #fad445;
      }

      .classic3-header {
        background-color: #fce43a;
      }

      .classic3-footer {
        background-color: #cdf4f3;
      }
    `
  }

  static get properties() {
    return {
      date: {type: String},
      dateFormat: {type: String},
      theme: {type: String},
      boldHeader: {type: Boolean},
      uppercaseHeader: {type: Boolean},
      grayscale: {type: Boolean},
      dateOffset: {type: Number},
    }
  }

  constructor() {
    super()
    this.date = 'DATE'
    this.dateFormat = 'M/D/YY'
    this.theme = 'classic1'
    this.boldHeader = true
    this.uppercaseHeader = false
    this.grayscale = false
    this.dateOffset = 0
  }

  render() {
    const times = ['11AM', '1PM', '3PM', '5PM', '7PM', '9PM', '10PM', 'W2d totals']
    const date = dayjs(this.date)

    let dayOfWeek = this.dataset.dayOfWeek

    if (this.uppercaseHeader) {
      dayOfWeek = dayOfWeek.toUpperCase()
    }

    return html`
      <table style="filter: ${this.grayscale ? 'grayscale(100%)' : 'none'}">
        <colgroup>
          <col class="${this.theme}-field" />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr class="${this.theme}-day">
            <td colspan="2" style="font-weight: ${this.boldHeader ? 'bold' : 'normal'}">${dayOfWeek}</td>
            <td colspan="3" style="padding-left: ${this.dateOffset}%">${date.isValid() ? date.format(this.dateFormat) : this.date}</td>
          </tr>
          <tr class="${this.theme}-header">
            <td>TIME</td>
            <td>SALES</td>
            <td>2hr. sales</td>
            <td>customer</td>
            <td>2hr.cust.</td>
          </tr>
        </thead>
        <tbody>
          ${times.map(time => html`
            <tr>
              <td>${time}</td>
              ${[...Array(4)].map(_ => html`<td contenteditable></td>`)}
            </tr>`)}
          <tr class="${this.theme}-footer">
            <td>Weather</td>
            <td colspan="4" contenteditable></td>
          </tr>
        </tbody>
      </table>`
  }
}

customElements.define('day-block', DayBlock)