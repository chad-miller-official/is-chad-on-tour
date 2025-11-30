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
        font-size: larger;
      }

      td {
        border: 1px solid black;
        padding: 2px;
      }

      td[contenteditable] {
        font-family: "Caveat", cursive;
      }

      thead > tr:first-of-type > td {
        border-left: none;
        border-right: none;
      }

      thead > tr:first-of-type > td:last-of-type {
        padding-left: 1.5ch;
      }

      .day-of-week {
        font-weight: bold;
      }

      .green {
        background-color: #c9f4d9;
      }

      .orange {
        background-color: #fad445;
      }

      .spacer {
        height: 3px;
      }

      .yellow {
        background-color: #fce43a;
      }
    `
  }

  static get properties() {
    return {
      date: {type: String},
    }
  }

  constructor() {
    super()
    this.date = 'DATE'
  }

  render() {
    const times = ['11AM', '1PM', '3PM', '5PM', '7PM', '9PM', '10PM']

    return html`
      <table>
        <colgroup>
          <col class="green" />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr class="yellow">
            <td colspan="2" class="day-of-week">${this.dataset.dayOfWeek}</td>
            <td colspan="3">${this.date}</td>
          </tr>
          <tr class="spacer"></tr>
          <tr class="orange">
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
          <tr class="green">
            <td>Weather</td>
            <td colspan="4" contenteditable></td>
          </tr>
        </tbody>
      </table>`
  }
}

customElements.define('day-block', DayBlock)