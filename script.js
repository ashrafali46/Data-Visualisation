let draw = false;

var i = 0;

init();

function init() {
  const table = $("#dt-table").DataTable({
    paging: false,
    searching: false,
    ordering: false,
    info: false
  });

  $("#dt-table tbody").on("click", "tr", function() {
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
    } else {
      table.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
    }
  });

  $("#rm-btn").click(function() {
    table
      .row(".selected")
      .remove()
      .draw(false);
  });

  function buildForm() {
    return [$("#country").val(), $("#population").val(), $("#density").val()];
  }

  $("#add-btn").on("click", function() {
    const formData = buildForm();
    if (
      formData[0].length === 0 ||
      formData[1].length === 0 ||
      formData[2].length === 0
    ) {
      alert("ENTER ALL THE FIELDS!!");
    } else {
      table.row.add([formData[0], formData[1], formData[2]]).draw(false);
      document.getElementById("country").value = "";
      document.getElementById("population").value = "";
      document.getElementById("density").value = "";
    }
  });

  const tableData = getTableData(table);
  createHighcharts(tableData);
  setTableEvents(table);
}

function getTableData(table) {
  const dataArray = [],
    countryArray = [],
    populationArray = [],
    densityArray = [];

  table.rows().every(function() {
    const data = this.data();
    countryArray.push(data[0]);
    populationArray.push(parseInt(data[1].replace(/\,/g, "")));
    densityArray.push(parseInt(data[2].replace(/\,/g, "")));
  });

  dataArray.push(countryArray, populationArray, densityArray);

  return dataArray;
}

function createHighcharts(data) {
  Highcharts.setOptions({
    lang: {
      thousandsSep: ","
    }
  });

  Highcharts.chart("chart", {
    title: {
      text: "Table Data to Chart Visualisation"
    },
    subtitle: {
      text: "Population of countries(2018)"
    },
    xAxis: [
      {
        categories: data[0],
        labels: {
          rotation: -45
        }
      }
    ],
    yAxis: [
      {
        title: {
          text: "Population (2018)"
        }
      },
      {
        title: {
          text: "Density (P/Km²)"
        },
        min: 0,
        opposite: true
      }
    ],
    series: [
      {
        name: "Population (2018)",
        color: "#0071A7",
        type: "column",
        data: data[1],
        tooltip: {
          valueSuffix: " M"
        }
      },
      {
        name: "Density (P/Km²)",
        color: "#FF404E",
        type: "spline",
        data: data[2],
        yAxis: 1
      }
    ],
    tooltip: {
      shared: true
    },
    legend: {
      backgroundColor: "#ececec",
      shadow: true
    },
    credits: {
      enabled: false
    },
    noData: {
      style: {
        fontSize: "16px"
      }
    }
  });
}

function setTableEvents(table) {
  table.on("page", () => {
    draw = true;
  });

  table.on("draw", () => {
    if (draw) {
      draw = false;
    } else {
      const tableData = getTableData(table);
      createHighcharts(tableData);
    }
  });
}
