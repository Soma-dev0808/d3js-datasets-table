let main, tableContainer, table, thead, tbody, columns;
const filterObj = {
  selectedValue: "",
};
const options = ["Active", "Inactive"]; // options for status filter

/**
 * Generate table with data
 * @param {Object[]} data - Data to show on table.
 */
const initTable = (data) => {
  if (!data) return;
  main = d3.select("main");

  // add select tag
  addSelect();

  // append table
  tableContainer = main.append("div").attr("class", "table-container");
  table = tableContainer.append("table").attr("class", "user-table");
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
      let newData = [];
      d.target.classList = [];

      // Sorting
      if (sortAscendingObj[thTxt]) {
        // Sort data by ascending order
        newData = data.sort((a, b) => sortTableData(a, b)(thTxt, true));

        // Update sorting status for each th in thead
        sortAscendingObj[thTxt] = false;
        d.target.classList.add("aes");
      } else {
        // Sort data by descending order
        newData = data.sort((a, b) => sortTableData(a, b)(thTxt, false));

        // Update sorting status for each th in thead
        sortAscendingObj[thTxt] = true;
        d.target.classList.add("des");
      }

      // Filtering
      if (options.includes(filterObj.selectedValue)) {
        newData = newData.filter(
          (v) => v["status"] === filterObj.selectedValue
        );
      }

      // update table
      updateTable(newData);
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

const sortTableData = (a, b) => {
  return (key, isAsc) => {
    _a = isAsc ? a : b;
    _b = isAsc ? b : a;

    if (typeof a[key] === "number") {
      return b[key] - a[key];
    }

    return _b[key].localeCompare(_a[key]);
  };
};

/**
 * Add select tag
 */
const addSelect = () => {
  // add select tag
  const select = main.append("select").on("change", (e) => {
    filterObj.selectedValue = e.target.value;
    let newData = tableData;

    // filter data if active or inactive is selected
    if (options.includes(filterObj.selectedValue)) {
      newData = tableData.filter((td) => td.status === filterObj.selectedValue);
    }

    // update table
    updateTable(newData);
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
 * Update table with data
 * @param {Object[]} newData - New data to show on table.
 */
const updateTable = (newData) => {
  // update table
  const rows = tbody.selectAll("tr").data(newData);

  rows.exit().remove();

  rows
    .selectAll("td")
    .data((row) => {
      return columns.map((column) => {
        return {
          column: column,
          value: row[column],
        };
      });
    })
    .text((d) => {
      return d.value;
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
initTable(tableData);
