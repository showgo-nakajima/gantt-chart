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
    // 左右button のイベントリスナーを設定
    var indentRightButton = document.getElementById('indent_right');
    var indentLeftButton = document.getElementById('indent_left');
    //右インデントボタンのクイックリスナー
    indentRightButton === null || indentRightButton === void 0 ? void 0 : indentRightButton.addEventListener('click', function () {
        changeIndent(true);
    });
    //左インデントボタンのクイックリスナー
    indentLeftButton === null || indentLeftButton === void 0 ? void 0 : indentLeftButton.addEventListener('click', function () {
        changeIndent(false);
    });
    //日付入力フィールドの変更リスナー
    document.querySelectorAll('.dateInpt').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            updateDateDifference(taskId);
        });
    });
    //開始日付入力フィールドの変更リスナー
    document.querySelectorAll('.actSt').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            moveStartBar(taskId);
        });
    });
    //終了日付入力フィールドの変更リスナー
    document.querySelectorAll('.actEd').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            moveEndBar(taskId);
        });
    });
    //プログレスバーの変更リスナー
    document.querySelectorAll('.prog').forEach(function (element) {
        element.addEventListener('input', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            var progress = Number(event.target.value);
            updateProgress(taskId, progress);
        });
    });
});
// 行を選択した際の処理
function selected(elem) {
    elem.addEventListener("click", function (event) {
        var target = event.target;
        // クリックされた要素が 'TD' タグであることを確認し、親要素が存在する場合
        if (target.tagName === "TD" && target.parentElement) {
            var row = target.parentElement;
            var secondTD_1 = row.querySelector("td:nth-child(2)");
            var TR = row.querySelectorAll("td");
            selectedRows.forEach(function (selectedTD) { return selectedTD.classList.remove("ui-selected"); });
            selectedRows = [secondTD_1];
            TR.forEach(function (td) { return td.classList.add("ui-selected"); });
        }
    });
}
// 親の 'TR' 要素を検索する関数
function findParentTR(element) {
    while (element && element.tagName !== "TR") {
        element = element.parentElement;
    }
    return element;
}
// 行選択時の処理
function selectRow(target) {
    var row = findParentTR(target);
    if (!row) {
        return;
    }
    var allRows = tbody === null || tbody === void 0 ? void 0 : tbody.querySelectorAll('tr.ui-selected');
    allRows === null || allRows === void 0 ? void 0 : allRows.forEach(function (tr) {
        tr.classList.remove("ui-selected");
    });
    // 選択された行に ui-selected クラスを追加
    row.classList.add("ui-selected");
}
// インデント（行のレベル）を変更する関数
function changeIndent(isIncrease) {
    selectedRows.forEach(function (row) {
        var currentIndent = parseInt(row.style.textIndent) || 0; // 現在のインデントを取得（ない場合は 0）
        if (!isNaN(currentIndent)) {
            // 現在のインデントが数値である場合
            var newIndent = isIncrease ? currentIndent + indentPx : currentIndent - indentPx; // 新しいインデントを計算
            if (newIndent >= 0 && newIndent <= 3 * indentPx) {
                // 新しいインデントが許容範囲内である場合
                row.style.textIndent = newIndent + "px"; // 新しいインデントを設定
            }
        }
    });
}
//時間換算
function calculateDuration(startDate, endDate) {
    var durationInMilliseconds = endDate.getTime() - startDate.getTime() + 24 * 60 * 60 * 1000;
    var durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return durationInDays;
}
//日付の差分を計算し、表示を更新する関数
function updateDateDifference(taskId) {
    var task = ganttChartRows.find(function (row) { return row.id === taskId; });
    var planStartDateInput = document.getElementById("planSt_".concat(taskId));
    var planEndDateInput = document.getElementById("planEd_".concat(taskId));
    var actStartDateInput = document.getElementById("actSt_".concat(taskId));
    var actEndDateInput = document.getElementById("actEd_".concat(taskId));
    var planDurationCell = document.getElementById("planDif_".concat(taskId));
    var actDurationCell = document.getElementById("actDif_".concat(taskId));
    var planStartDate = new Date(planStartDateInput.value);
    var planEndDate = new Date(planEndDateInput.value);
    var actStartDate = new Date(actStartDateInput.value);
    var actEndDate = new Date(actEndDateInput.value);
    var planDateDifference = calculateDuration(planStartDate, planEndDate);
    var actDateDifference = calculateDuration(actStartDate, actEndDate);
    // 日数がNaNの場合、0に設定
    if (isNaN(planDateDifference)) {
        planDurationCell.textContent = '0';
    }
    else {
        // 日数が0未満の場合、0に設定
        if (planDateDifference < 0) {
            alert("日数は0未満にすることはできません。");
            planDurationCell.textContent = '0';
            planStartDateInput.value = "";
            planEndDateInput.value = "";
        }
        else {
            planDurationCell.textContent = planDateDifference.toString();
        }
    }
    // 同様に実績の日数も処理
    if (isNaN(actDateDifference)) {
        actDurationCell.textContent = '0';
    }
    else {
        if (actDateDifference < 0) {
            alert("日数は0未満にすることはできません.");
            actDurationCell.textContent = '0';
            actStartDateInput.value = "";
            actEndDateInput.value = "";
        }
        else {
            actDurationCell.textContent = actDateDifference.toString();
        }
    }
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
    var maxWidth = (planBar === null || planBar === void 0 ? void 0 : planBar.clientWidth) || 0;
    var newWidth = (progress / 100) * maxWidth;
    if (progBar) {
        progBar.style.width = "".concat(newWidth, "px");
        progBar.style.backgroundColor = '#ffc135';
    }
}
var tbody = document.getElementById('column_table_body');
var draggedRow = null;
function handleDragStart(e) {
    draggedRow = this;
    startY = e.clientY;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    e.stopPropagation();
}
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    if (draggedRow) {
        var currentY = e.clientY;
        if (startY !== null) { // startY が null でないかを確認
            var deltaY = currentY - startY;
            // 垂直ドラッグか水平ドラッグかを判定
            if (Math.abs(deltaY) > 5) {
                // 垂直ドラッグの場合は行の入れ替え
                e.stopPropagation();
            }
            else {
                // 水平ドラッグの場合はプログレスバーの処理
                e.preventDefault();
            }
        }
    }
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
        tbody === null || tbody === void 0 ? void 0 : tbody.insertBefore(draggedRow, this);
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
