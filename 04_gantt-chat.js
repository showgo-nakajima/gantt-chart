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
            var secondTD_1_1 = row.querySelector("td:nth-child(2)");
            var AllTD = row.querySelectorAll("td");
            // Ctrl キーが押された場合の処理
            if (event.ctrlKey) {
                if (!selectedRows.includes(secondTD_1_1)) {
                    // すべての 'TD' 要素に 'ui-selected' クラスを追加し、選択行に追加
                    AllTD.forEach(function (td) { return td.classList.add("ui-selected"); });
                    selectedRows.push(AllTD);
                }
                else {
                    // すべての 'TD' 要素から 'ui-selected' クラスを削除し、選択行から削除
                    AllTD.forEach(function (td) { return td.classList.remove("ui-selected"); });
                    selectedRows = selectedRows.filter(function (selectedTD) { return selectedTD !== secondTD_1_1; });
                }
            }
            else {
                // Ctrl キーが押されていない場合、すべての選択行をクリアして新しい行を選択
                selectedRows.forEach(function (selectedTD) { return selectedTD.forEach(function (td) { return td.classList.remove("ui-selected"); }); });
                selectedRows = [AllTD];
                AllTD.forEach(function (td) { return td.classList.add("ui-selected"); });
            }
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
function selectRow(target) {
    var row = findParentTR(target);
    if (!row) { //row が null なら何もしない。
        return;
    }
    //-------------------
    // 行クリック時の処理 |
    //-------------------
    //Ctrlキーが押されている場合と押されていない場合の行選択処理
    if (event.ctrlKey) {
        //Ctrlキーが押されている場合（複数行の選択）
        if (!selectedRows.includes(row)) {
            //選択中の行リストに追加された行を含まない場合
            row.classList.add("ui-selected"); //対象行を選択状態にする
            selectedRows.push(row); //選択中の行リストに追加。
        }
        else {
            //選択中の行リストに含まれている場合（選択解除）
            row.classList.remove("ui-selected"); //対象行の選択状態を解除
            selectedRows = selectedRows.filter(function (selectedRow) { return selectedRow !== row; }); //選択中の行リストから対象行を削除
        }
    }
    else {
        // Ctrlキーが押されていない場合（新たな行を選択し、他の選択を解除）
        selectedRows.forEach(function (selectedRow) { return selectedRow.classList.remove("ui-selected"); }); //既存の選択中の行の選択を解除
        selectedRows = [row]; //選択中の行リストを新たな行で上書き
        row.classList.add("ui-selected"); //[END]対象行を選択状態にする
    }
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
    var planStartDate = new Date(document.getElementById("planSt_".concat(taskId)).value);
    var planEndDate = new Date(document.getElementById("planEd_".concat(taskId)).value);
    var actStartDate = new Date(document.getElementById("actSt_".concat(taskId)).value);
    var actEndDate = new Date(document.getElementById("actEd_".concat(taskId)).value);
    var planDateDifference = calculateDuration(planStartDate, planEndDate);
    var actDateDifference = calculateDuration(actStartDate, actEndDate);
    // 日数が0未満の場合
    if (planDateDifference < 0) {
        alert("日数は0未満にすることはできません。");
        planDateDifference = 0; // 日数を0に設定
        document.getElementById("planSt_".concat(taskId)).value = ""; // 予定開始日を空欄に
        document.getElementById("planEd_".concat(taskId)).value = ""; // 予定終了日を空欄に
    }
    if (actDateDifference < 0) {
        alert("日数は0未満にすることはできません。");
        actDateDifference = 0; // 日数を0に設定
        document.getElementById("actSt_".concat(taskId)).value = ""; // 実績開始日を空欄に
        document.getElementById("actEd_".concat(taskId)).value = ""; // 実績終了日を空欄に
    }
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
