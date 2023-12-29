filter = 0; // 0: audio, 1: creator, 2: collection
type = "All";

searchFilter = document.querySelector('.search-filter');
select = searchFilter.querySelector('select');
searchFilter.addEventListener('change', () => {
    filter = select.selectedIndex;
    display(searchbarContent);
});

const listItems = document.querySelectorAll('.audio-row');
searchbar = document.querySelector('.searchbar');

var searchbarContent = "";

searchbar.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    searchbarContent = searchTerm;
    display(searchbarContent);
});

function display(searchTerm) {
    listItems.forEach(function (item) {
        const itemText = item.textContent.toLowerCase();
        const itemType = getItemType(item);

        if ((itemText.indexOf(searchTerm) !== -1 || searchTerm == "") && (itemType == type || type == "All"))
            item.style.display = 'table-row';
        else
            item.style.display = 'none';
    });
}

function getItemType(item) {
    const itemText = item.textContent.toLowerCase();

    if (filter === 0) {
        return 'audio';
    } else if (filter === 1) {
        return 'creator';
    } else if (filter === 2) {
        return 'collection';
    } else {
        // Default case or additional conditions based on your data
        return '';
    }
}
