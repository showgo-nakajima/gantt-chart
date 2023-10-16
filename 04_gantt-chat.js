var ganttChartRows = [
    {
        id: 1,
        taskName: 'ユーザー一覧画面作成',
    },
    {
        id: 2,
        taskName: 'ユーザー登録画面作成',
    },
    {
        id: 3,
        taskName: 'ユーザー削除画面作成',
    },
];
var selectedRows = [];
var indentPx = 12;
var datePositions = {};
var widAdd = 19;
function calculateAndDisplayDuration() {
    ganttChartRows.forEach(function (row) {
        var taskId = row.id;
        var planStartDateInput = document.getElementById("planSt_".concat(taskId));
        var planEndDateInput = document.getElementById("planEd_".concat(taskId));
        var actStartDateInput = document.getElementById("actSt_".concat(taskId));
        var actEndDateInput = document.getElementById("actEd_".concat(taskId));
        var planDurationCell = document.getElementById("planDif_".concat(taskId));
        var actDurationCell = document.getElementById("actDif_".concat(taskId));
        if (planStartDateInput && planEndDateInput && planDurationCell) {
            var planStartDate = new Date(planStartDateInput.value);
            var planEndDate = new Date(planEndDateInput.value);
            var planDuration = calculateInclusiveDuration(planStartDate, planEndDate);
            planDurationCell.textContent = planDuration.toString();
        }
        if (actStartDateInput && actEndDateInput && actDurationCell) {
            var actStartDate = new Date(actStartDateInput.value);
            var actEndDate = new Date(actEndDateInput.value);
            var actDuration = calculateInclusiveDuration(actStartDate, actEndDate);
            actDurationCell.textContent = actDuration.toString();
        }
    });
}
function calculateInclusiveDuration(startDate, endDate) {
    var inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setDate(endDate.getDate() + 1);
    var durationInMilliseconds = inclusiveEndDate.getTime() - startDate.getTime();
    var durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
    return durationInDays;
}
function attachDateChangeListeners() {
    ganttChartRows.forEach(function (row) {
        var taskId = row.id;
        var planStartDateInput = document.getElementById("planSt_".concat(taskId));
        var planEndDateInput = document.getElementById("planEd_".concat(taskId));
        var actStartDateInput = document.getElementById("actSt_".concat(taskId));
        var actEndDateInput = document.getElementById("actEd_".concat(taskId));
        if (planStartDateInput) {
            planStartDateInput.addEventListener('change', calculateAndDisplayDuration);
        }
        if (planEndDateInput) {
            planEndDateInput.addEventListener('change', calculateAndDisplayDuration);
        }
        if (actStartDateInput) {
            actStartDateInput.addEventListener('change', calculateAndDisplayDuration);
        }
        if (actEndDateInput) {
            actEndDateInput.addEventListener('change', calculateAndDisplayDuration);
        }
    });
}
document.addEventListener("DOMContentLoaded", function () {
    // クリック行着色
    selected(document.getElementById("column_table_body"));
    // その他のイベントリスナーを設定
    var indentRightButton = document.getElementById('indent_right');
    var indentLeftButton = document.getElementById('indent_left');
    indentRightButton === null || indentRightButton === void 0 ? void 0 : indentRightButton.addEventListener('click', function () {
        changeIndent(true);
    });
    indentLeftButton === null || indentLeftButton === void 0 ? void 0 : indentLeftButton.addEventListener('click', function () {
        changeIndent(false);
    });
    document.querySelectorAll('.dateInpt').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            updateDateDifference(taskId);
        });
    });
    document.querySelectorAll('.actSt').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            moveStartBar(taskId);
        });
    });
    document.querySelectorAll('.actEd').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            moveEndBar(taskId);
        });
    });
    document.querySelectorAll('.prog').forEach(function (element) {
        element.addEventListener('input', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            var progress = Number(event.target.value);
            updateProgress(taskId, progress);
        });
    });
});
//行選択時の処理
function selected(elem) {
    elem.addEventListener("click", function (event) {
        var target = event.target;
        if (target.tagName === "TD" && target.parentElement) {
            var row = target.parentElement;
            var secondTD_1_1 = row.querySelector("td:nth-child(2)");
            var AllTD = row.querySelectorAll("td");
            if (event.ctrlKey) {
                if (!selectedRows.includes(secondTD_1_1)) {
                    AllTD.forEach(function (td) { return td.classList.add("ui-selected"); });
                    selectedRows.push(AllTD);
                }
                else {
                    AllTD.forEach(function (td) { return td.classList.remove("ui-selected"); });
                    selectedRows = selectedRows.filter(function (selectedTD) { return selectedTD !== secondTD_1_1; });
                }
            }
            else {
                selectedRows.forEach(function (selectedTD) { return selectedTD.classList.remove("ui-selected"); });
                selectedRows = [secondTD_1_1];
                AllTD.forEach(function (td) { return td.classList.add("ui-selected"); });
            }
        }
    });
}
function findParentTR(element) {
    while (element && element.tagName !== "TR") {
        element = element.parentElement;
    }
    return element;
}
function selectRow(target) {
    var row = findParentTR(target);
    if (!row) {
        return;
    }
    if (event.ctrlKey) {
        if (!selectedRows.includes(row)) {
            row.classList.add("ui-selected");
            selectedRows.push(row);
        }
        else {
            row.classList.remove("ui-selected");
            selectedRows = selectedRows.filter(function (selectedRow) { return selectedRow !== row; });
        }
    }
    else {
        selectedRows.forEach(function (selectedRow) { return selectedRow.classList.remove("ui-selected"); });
        selectedRows = [row];
        row.classList.add("ui-selected");
    }
}
function changeIndent(isIncrease) {
    selectedRows.forEach(function (row) {
        var currentIndent = parseInt(row.style.textIndent) || 0;
        if (!isNaN(currentIndent)) {
            var newIndent = isIncrease ? currentIndent + indentPx : currentIndent - indentPx;
            if (newIndent >= 0 && newIndent <= 3 * indentPx) {
                row.style.textIndent = newIndent + "px";
            }
        }
    });
}
function calculateDuration(startDate, endDate) {
    var durationInMilliseconds = endDate.getTime() - startDate.getTime() + 24 * 60 * 60 * 1000;
    var durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return durationInDays;
}
function updateDateDifference(taskId) {
    var task = ganttChartRows.find(function (row) { return row.id === taskId; });
    var planStartDate = new Date(document.getElementById("planSt_".concat(taskId)).value);
    var planEndDate = new Date(document.getElementById("planEd_".concat(taskId)).value);
    var actStartDate = new Date(document.getElementById("actSt_".concat(taskId)).value);
    var actEndDate = new Date(document.getElementById("actEd_".concat(taskId)).value);
    var planDateDifference = calculateDuration(planStartDate, planEndDate);
    var actDateDifference = calculateDuration(actStartDate, actEndDate);
    document.getElementById("planDif_".concat(taskId)).textContent = planDateDifference.toString();
    document.getElementById("actDif_".concat(taskId)).textContent = actDateDifference.toString();
}
function moveStartBar(taskId) {
    // バーの位置を計算し移動
}
function moveEndBar(taskId) {
    // バーの位置を計算し移動
}
//バーが伸びたり縮んだりする処理
function updateProgress(taskId, progress) {
    var planBar = document.getElementById("planBar_".concat(taskId));
    var progBar = document.getElementById("progBar_".concat(taskId));
    var maxWidth = planBar.clientWidth;
    var newWidth = (progress / 100) * maxWidth;
    progBar.style.width = "".concat(newWidth, "px");
    progBar.style.backgroundColor = '#ffc135';
}
var tbody = document.getElementById('column_table_body');
var draggedRow = null;
function handleDragStart(e) {
    draggedRow = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}
function handleDragEnter(e) {
    this.classList.add('over');
}
function handleDragLeave(e) {
    this.classList.remove('over');
}
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (draggedRow !== this) {
        tbody.insertBefore(draggedRow, this);
    }
    this.classList.remove('over');
    return false;
}
function handleDragEnd() {
    this.classList.remove('over');
    draggedRow = null;
}
var rows = tbody === null || tbody === void 0 ? void 0 : tbody.querySelectorAll('tr');
if (rows) {
    rows.forEach(function (row) {
        row.draggable = true;
        row.addEventListener('dragstart', handleDragStart);
        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('dragenter', handleDragEnter);
        row.addEventListener('dragleave', handleDragLeave);
        row.addEventListener('drop', handleDrop);
        row.addEventListener('dragend', handleDragEnd);
    });
}
