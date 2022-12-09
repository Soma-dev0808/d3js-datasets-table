let main, form, tableContainer, table, thead, tbody, columns;
const filterObj = {
  activeStatusValue: "",
  searchIdValue: "",
  searchDateFromValue: "",
  searchDateToValue: "",
  searchUsernameValue: "",
  searchPhoneNumberValue: "",
};
const filterLabelObj = {
  activeStatusValue: { text: "Status", type: "select" },
  searchDateFromValue: { text: "Date from", type: "date" },
  searchDateToValue: { text: "Date to", type: "date" },
  searchIdValue: { text: "Id", type: "number" },
  searchUsernameValue: { text: "Username", type: "text" },
  searchPhoneNumberValue: { text: "Phone Numner", type: "number" },
};
const options = ["Active", "Inactive"]; // options for status filter

/**
 * Generate table with data
 * @param {Object[]} data - Data to show on table.
 */
const initTable = (data) => {
  if (!data) return;
  main = d3.select("main");
  form = d3.select("form").attr("class", "filter-form").select("fieldset");

  // add select tag
  addFilterSelect("activeStatusValue");

  // add filter for date
  addFilterDate("searchDateFromValue");

  // add filter for date
  addFilterDate("searchDateToValue");

  // add search input for Id
  addSearchInput("searchIdValue");

  // add search input for username
  addSearchInput("searchUsernameValue");

  // add search input for a phone number
  addSearchInput("searchPhoneNumberValue");

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
      return getColumnName(column);
    })
    .on("click", (d) => {
      const thTxt = getColumnName(d.target.innerText, true);

      let newData = [];
      d.target.classList = [];

      // Sorting
      // Remove current sorting emoji
      document.querySelector(".aes")?.classList.remove("aes");
      document.querySelector(".des")?.classList.remove("des");
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

      // Reset other thead th's sorting status
      Object.keys(sortAscendingObj).forEach((key) => {
        if (key !== thTxt) sortAscendingObj[key] = true;
      });

      newData = execFilter(newData);

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

/**
 * Add select tag
 * @param {Object} a - data object to compare
 * @param {Object} b - data object to compare
 */
const sortTableData = (a, b) => {
  return (key, isAsc) => {
    _a = isAsc ? a : b;
    _b = isAsc ? b : a;

    if (typeof _a[key] === "number") {
      return _b[key] - _a[key];
    }

    return _b[key].localeCompare(_a[key]);
  };
};

/**
 * Add filter select tag
 * @param {string} objKey - objKey which contains filter status
 */
const addFilterSelect = (objKey) => {
  const formDiv = form.append("div");
  // add label tag
  formDiv
    .append("label")
    .attr("for", `select-${filterLabelObj[objKey].text.toLowerCase()}`)
    .html(filterLabelObj[objKey].text);

  // add select tag
  const select = formDiv
    .append("select")
    .attr("id", `select-${filterLabelObj[objKey].text.toLowerCase()}`)
    .attr("class", "filter-select")
    .on("change", (e) => {
      filterObj[objKey] = e.target.value;
      let newData = execFilter([...tableData]);

      // update table
      updateTable(newData);
    });

  // Add an initial option:
  select.append("option").html("All");

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
 * Add filter date input tag
 * @param {string} objKey - objKey which contains filter status
 */
const addFilterDate = (objKey) => {
  const filterLabelData = filterLabelObj[objKey];
  const formDiv = form.append("div");
  // add label tag
  formDiv
    .append("label")
    .attr("for", `select-${filterLabelObj[objKey].text.toLowerCase()}`)
    .html(filterLabelObj[objKey].text);

  // add select tag
  const select = formDiv
    .append("input")
    .attr("id", `select-${filterLabelObj[objKey].text.toLowerCase()}`)
    .attr("class", "filter-date")
    .attr("type", filterLabelData.type)
    .on("change", (e) => {
      filterObj[objKey] = e.target.value;
      let newData = execFilter([...tableData]);

      // update table
      updateTable(newData);
    });

  // Add an initial option:
  select.append("option").html("All");

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
 * Add filter input tag
 * @param {string} objKey - objKey which contains filter status
 */
const addSearchInput = (objKey) => {
  const filterLabelData = filterLabelObj[objKey];
  const formDiv = form.append("div");
  // add label tag
  formDiv
    .append("label")
    .attr("for", `select-${filterLabelData.text.toLowerCase()}`)
    .html(filterLabelData.text);

  // add input tag
  formDiv
    .append("input")
    .attr("id", `select-${filterLabelData.text.toLowerCase()}`)
    .attr("type", filterLabelData.type)
    .attr("class", "filter-input")
    .on("keyup", (e) => {
      filterObj[objKey] = e.target.value;
      let newData = execFilter([...tableData]);

      // update table
      updateTable(newData);
    });
};

/**
 * Update table with data
 * @param {Object[]} data - New data to show on table.
 * @return {Object[]} - Filtered data.
 */
const execFilter = (data) => {
  // filtering data if active or inactive is selected
  if (options.includes(filterObj.activeStatusValue)) {
    data = data.filter((td) => td["status"] === filterObj.activeStatusValue);
  }

  // filtering data for username
  if (filterObj.searchIdValue) {
    data = data.filter(
      (td) =>
        td["id"]
          .toString()
          .toUpperCase()
          .indexOf(filterObj.searchIdValue.toUpperCase()) !== -1
    );
  }

  // filtering data from for created_date
  if (filterObj.searchDateFromValue) {
    data = data.filter((td) => {
      return td["date_created"] > filterObj.searchDateFromValue;
    });
  }

  // filtering data to for created_date
  if (filterObj.searchDateToValue) {
    data = data.filter((td) => {
      return td["date_created"] < filterObj.searchDateToValue;
    });
  }

  // filtering data for username
  if (filterObj.searchUsernameValue) {
    data = data.filter(
      (td) =>
        td["username"]
          .toUpperCase()
          .indexOf(filterObj.searchUsernameValue.toUpperCase()) !== -1
    );
  }

  // filtering data for a phone number
  if (filterObj.searchPhoneNumberValue) {
    data = data.filter(
      (td) =>
        td["phone_number"]
          .toUpperCase()
          .indexOf(filterObj.searchPhoneNumberValue.toUpperCase()) !== -1
    );
  }

  return data;
};

/**
 * Update table with data
 * @param {Object[]} newData - New data to show on table.
 */
const updateTable = (newData) => {
  // Reset table
  tbody.selectAll("tr").remove();

  // create a row for each object in the data
  const rows = tbody.selectAll("tr").data(newData).enter().append("tr");

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
 * Get dummy data.
 * @param {number} numberOfData - Number of data to return.
 * @return {object[]}
 */
const getDummyData = (numberOfData) => {
  return [...new Array(numberOfData)].map((_, idx) => {
    const randomBool = Math.random() < 0.5;

    return {
      id: idx + 1,
      date_created: getRandomDate(new Date(2012, 0, 1), new Date()),
      status: randomBool ? "Active" : "Inactive",
      username: getRandomUserName(),
      phone_number: Math.random().toString().slice(2, 11),
    };
  });
};

/**
 * Get random date.
 * @param {Date} start - Date from
 * @param {Date} end - Date end
 * @return {string}
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
 * @return {string}
 */
const getRandomUserName = () => {
  const rA = Math.floor(Math.random() * a.length);
  const rB = Math.floor(Math.random() * b.length);
  return a[rA] + " " + b[rB];
};

/**
 * Get column name.
 * @param {string} plainStr - string before modification
 * @param {boolean} shouldRestore - if should restore original string
 * @return {string}
 */
const getColumnName = (plainStr, shouldRestore = false) => {
  if (!plainStr) return "";
  if (shouldRestore) {
    return plainStr.split(" ").join("_").toLowerCase();
  }
  return plainStr.split("_").join(" ").toUpperCase();
};

const tableData = getDummyData(500);

// Execute
initTable(tableData);
