let body, table, thead, tbody, columns;
/**
 * Generate table with data
 * @param {Object[]} data - Data to show on table.
 */
const generateTable = (data) => {
  if (!data) return;
  body = d3.select("body");

  // add select tag
  addSelect();

  // append table
  table = body.append("table");
  thead = table.append("thead");
  tbody = table.append("tbody");
  columns = Object.keys(data[0]);

  // keep sort status of th
  const sortAscendingObj = {};
  columns.forEach((c) => (sortAscendingObj[c] = true));

  // append the header row
  thead
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text((column) => {
      return column;
    })
    .on("click", (d) => {
      const thTxt = d.target.innerText;
      if (sortAscendingObj[thTxt]) {
        rows.sort((a, b) => d3.ascending(b[thTxt], a[thTxt]));
        sortAscendingObj[thTxt] = false;
      } else {
        rows.sort((a, b) => d3.descending(b[thTxt], a[thTxt]));
        sortAscendingObj[thTxt] = true;
      }
    });

  // create a row for each object in the data
  const rows = tbody.selectAll("tr").data(data).enter().append("tr");

  // create a cell in each row for each column
  rows
    .selectAll("td")
    .data((row) => {
      return columns.map((column) => {
        return { column: column, value: row[column] };
      });
    })
    .enter()
    .append("td")
    .text((d) => {
      return d.value;
    });
};

/**
 * Add select tag
 * @param {object} body - body element.
 */
const addSelect = () => {
  const options = ["Active", "Inactive"];
  // add select tag
  const select = body.append("select").on("change", (e) => {
    const selectedValue = e.target.value;
    let newData = tableData;

    // filter data if active or inactive is selected
    if (options.includes(selectedValue)) {
      newData = tableData.filter((td) => td.status === selectedValue);
    }

    // update table
    const rows = tbody.selectAll("tr").data(newData);

    rows.exit().remove();

    rows
      .selectAll("td")
      .data(function (row) {
        return columns.map(function (column) {
          return {
            column: column,
            value: row[column],
          };
        });
      })
      .text(function (d) {
        return d.value ? d.value : 0;
      });
  });

  // Add an initial option:
  select.append("option").html("Filter by status:");

  // Add the columns as options:
  select
    .selectAll(null)
    .data(options)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    });
};

/**
 * Get dummy data.
 * @param {number} numberOfData - Number of data to return.
 */
const getDummyData = (numberOfData) => {
  return [...new Array(numberOfData)].map((_, idx) => {
    const randomBool = Math.random() < 0.5;

    return {
      id: idx + 1,
      dateCreated: getRandomDate(new Date(2012, 0, 1), new Date()),
      status: randomBool ? "Active" : "Inactive",
      username: getRandomUserName(),
      phoneNumber: Math.random().toString().slice(2, 11),
    };
  });
};

/**
 * Get random date.
 * @param {Date} start - Date from
 * @param {Date} end - Date end
 */
const getRandomDate = (start, end) => {
  const radomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  let month = radomDate.getMonth() + 1;
  let date = radomDate.getDate();

  if (month < 10) month = `0${month}`;
  if (date < 10) date = `0${date}`;

  return `${radomDate.getFullYear()}-${month}-${date}`;
};

// random dummy usernames
const a = [
  "Doug S",
  "Nancie",
  "Albert",
  "Elton",
  "Karin",
  "Kimberly",
  "James",
  "Sandra",
  "David",
  "Titus",
];
const b = [
  "Lewis",
  "Bunting",
  "Christensen",
  "Puig",
  "Turner",
  "Thomas",
  "Johnson",
  "James",
  "Carter",
  "Carlisle",
];
/**
 * Get random username.
 */
const getRandomUserName = () => {
  const rA = Math.floor(Math.random() * a.length);
  const rB = Math.floor(Math.random() * b.length);
  return a[rA] + b[rB];
};

const tableData = getDummyData(500);

// Execute
generateTable(tableData);
