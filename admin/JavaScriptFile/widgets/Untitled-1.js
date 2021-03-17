// prepare the data
var data = generatedata(15, true);
var source = {
    localdata: data,
    datafields: [{
            name: 'firstname',
            type: 'string'
        },
        {
            name: 'lastname',
            type: 'string'
        },
        {
            name: 'available',
            type: 'bool'
        }
    ],
    datatype: "array"
};
var dataAdapter = new $.jqx.dataAdapter(source);
// initialize jqxGrid
$("#grid").jqxGrid({
    width: 430,
    source: dataAdapter,
    editable: true,
    columns: [{
            text: 'Available',
            datafield: 'available',
            columntype: 'checkbox',
            width: 70
        }, {
            text: 'First Name',
            editable: false,
            datafield: 'firstname',
            width: 120
        },
        {
            text: 'Last Name',
            editable: false,
            datafield: 'lastname',
            width: 120
        },
        {
            text: 'Button',
            editable: false,
            datafield: 'button',
            width: 100,
            createwidget: function (row, column, value, htmlElement) {
                var rowId = row.boundindex;
                var data = $('#grid').jqxGrid('getrowdata', rowId);
                var button = $("<input value='Click' type='button'>");

                button.addClass(`btn-${rowId}`);
                $(htmlElement).append(button);
                button.jqxButton({
                    template: "success",
                    height: '100%',
                    width: '100%'
                });
                button.click(function (event) {
                    alert('clicked');
                });

                if (data.available) {
                    $(`.btn-${rowId}`).jqxButton({
                        disabled: true
                    })
                }
            },
            initwidget: function (row, column, value, htmlElement) {}
        }
    ]
});

$("#grid").on('cellvaluechanged', function (event) {
    var args = event.args;
    var datafield = event.args.datafield;
    var rowBoundIndex = args.rowindex;
    var value = args.newvalue;

    if (datafield === 'available') {
        if (value) {
            $(`.btn-${rowBoundIndex}`).jqxButton({
                disabled: true
            });
        } else {
            $(`.btn-${rowBoundIndex}`).jqxButton({
                disabled: false
            })
        }
    }
});