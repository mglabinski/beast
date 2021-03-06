
var dateFormat = 'DD.MM.YYYY HH:mm';

var records = [];
var filteredRecords = []; //=records (bez filtracji)
var sortKey = 'firstName';
var order = 1; // 1 - rosnąco, -1 - malejąco
var page = 1;
var rowsOnPage = 5;

var filter = {};

function getPage(records) {
  var first = (page - 1) * rowsOnPage;
  return records.slice(first, first + rowsOnPage); // wyswietlanie 0-4, 5-9 10-14
}

function renderTable() { //pojedyncze renderowanie tablicy

  var recordsToDisplay = getPage(filteredRecords);//funkcja getPage wybiera rekordy do wyświetlenia

  var table = '';
  for (x in recordsToDisplay) {
    var record = recordsToDisplay[x];
    table += '<tr><td>' +  record.firstName + '<td>' + record.lastName +'<td>' + moment(record.dateOfBirth).format(dateFormat)
    + '<td>' + record.function + '<td>' + record.experience + '</td></tr>';
  };
  $('#container #data').html(table);//  wrzucam inner html
}


function sortRecords(newSortKey) {

  if (sortKey === newSortKey) {// jezeli 2 raz klikne na to samo to sie zmienia kolejnosc
    order = -order;
  }

  sortKey = newSortKey;

  filteredRecords.sort(function(a, b){ //sortujemy w srodku records(json)
    var result =  ((a[sortKey] < b[sortKey]) ? -1 : ((a[sortKey] > b[sortKey]) ? 1:0));
    return result * order;// reverse sorting
  });
  renderTable();
}

$('th.firstName .sort').click(function() {
  sortRecords('firstName');
});

$('th.lastName .sort').click(function() {
  sortRecords('lastName');
});

$('th.function .sort').click(function() {
  sortRecords('function');
});

$('th.experience .sort').click(function() {
  sortRecords('experience');
});

$('th.dateOfBirth .sort').click(function() {
  sortRecords('dateOfBirth');
});

$('.paging .previous').click(function() {
  if (page>1){
    page -= 1;
    renderTable();
  }
});

$('.paging .next').click(function() {
  var numberOfPages = Math.trunc((filteredRecords.length - 1) / rowsOnPage + 1);//wylicza mi liczbe stron
  if (page < numberOfPages){
    page += 1;
    renderTable();
  }
});

$('th.firstName .filter').change(function() {
  filterTable('firstName', $(this).val());
});

$('th.lastName .filter').change(function() {
  filterTable('lastName', $(this).val());
});

$('th.function .filter').change(function() {
  filterTable('function', $(this).val());
});

$('th.experience .filter').change(function() {
  filterTable('experience', $(this).val());
});

$('th.dateOfBirth .filter').pickadate({//konfiguracja pickdate
  format: 'dd.mm.yyyy',
  selectYears: 100,
  selectMonths: true
});

$('th.dateOfBirth .filter').change(function() {
  console.log( $(this).val());
  filterTable('dateOfBirth', $(this).val());
});

function stringFilter(value, filterValue) {
  if (!filterValue) { //sprawdza czy jest podana wartosc formularza
    return true;
  } else {
    return value.toLowerCase().lastIndexOf(filterValue.toLowerCase(), 0) === 0; // https://www.w3schools.com/JSREF/jsref_lastindexof.asp
  }
}

function intFilter(value, filterValue) {
  if (!filterValue && filterValue != 0 || filterValue === '') { //0==false js // gdy usuwam z inputa, daje mi pusty string
    return true;
  } else {
    return value == filterValue; // nie === bo rowna sie dany typ , a == to nie
  }
}

function dateFilter(value, filterValue) {
  var stringValue = moment(value).format(dateFormat);
  return stringFilter(stringValue, filterValue);
}

function filterTable(newKey, newValue) {

  filter[newKey] = newValue;

  filteredRecords = records.filter(function(r) {
    return stringFilter(r.firstName, filter.firstName) &&
    stringFilter(r.lastName, filter.lastName) &&
    dateFilter(r.dateOfBirth, filter.dateOfBirth) &&
    stringFilter(r.function, filter.function) &&
    intFilter(r.experience, filter.experience);
  });
  page = 1;
  renderTable();
}

$(document).ready(function () {

  $.getJSON('https://raw.githubusercontent.com/mglabinski/beast/master/danee.json', function(result){

    records = result;

    for (i in records) {
      records[i].dateOfBirth = moment(records[i].dateOfBirth, dateFormat).toDate();//konwersja moment
    }

    filteredRecords = records;
    renderTable();
  });

});
