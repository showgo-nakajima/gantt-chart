var ganttChartRows = [
    {
        id: 1,
        taskName: 'ユーザー一覧画面作成',
        // 他のプロパティ
    },
    {
        id: 2,
        taskName: 'ユーザー登録画面作成',
        // 他のプロパティ
    },
    {
        id: 3,
        taskName: 'ユーザー削除画面作成',
        // 他のプロパティ
    },
    // 他のタスクを追加
];
// 複数選択行入れ替え
var selectedRows = [];
var indentPx = 12;
var datePositions = {};
var widAdd = 19;
// 日数計算とセルへの表示を行う関数
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
// 開始日と終了日を含む日数を計算する関数
function calculateInclusiveDuration(startDate, endDate) {
    // 開始日を含めるため、1日を追加してから日数を計算
    var inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setDate(endDate.getDate() + 1);
    var durationInMilliseconds = inclusiveEndDate.getTime() - startDate.getTime();
    var durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
    return durationInDays;
}
// 予定開始日・終了日、実績開始日・終了日の変更イベントに関連付ける
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
    // CSS関連の処理は省略
    var _a, _b;
    // 複数選択行入れ替え
    multiDrag(document.getElementById("column_table_body"));
    // その他のイベントリスナーを設定
    // →インデント処理のイベントリスナー
    (_a = document.getElementById('indent_right')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        changeIndent(true);
    });
    // ←インデント処理のイベントリスナー
    (_b = document.getElementById('indent_left')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        changeIndent(false);
    });
    // 日数計算のイベントリスナー
    document.querySelectorAll('.dateInpt').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            updateDateDifference(taskId);
        });
    });
    // 予定/実績開始日変更時のバー移動のイベントリスナー
    document.querySelectorAll('.actSt').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            moveStartBar(taskId);
        });
    });
    // 予定/実績終了日変更時のバー移動のイベントリスナー
    document.querySelectorAll('.actEd').forEach(function (element) {
        element.addEventListener('change', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            moveEndBar(taskId);
        });
    });
    // 進捗率描画のイベントリスナー
    document.querySelectorAll('.prog').forEach(function (element) {
        element.addEventListener('input', function (event) {
            var taskId = Number(event.target.id.split('_')[1]);
            var progress = Number(event.target.value);
            updateProgress(taskId, progress);
        });
    });
});
// 複数選択行入れ替え
function multiDrag(elem) {
    elem.addEventListener("click", function (event) {
        var target = event.target;
        if (target.tagName === "TD" && target.parentElement) {
            var row = target.parentElement;
            var secondTD_1 = row.querySelector("td:nth-child(2)");
            if (event.ctrlKey) {
                if (!selectedRows.includes(secondTD_1)) {
                    secondTD_1.classList.add("ui-selected");
                    selectedRows.push(secondTD_1);
                }
                else {
                    secondTD_1.classList.remove("ui-selected");
                    selectedRows = selectedRows.filter(function (selectedTD) { return selectedTD !== secondTD_1; });
                }
            }
            else {
                selectedRows.forEach(function (selectedTD) { return selectedTD.classList.remove("ui-selected"); });
                selectedRows = [secondTD_1];
                secondTD_1.classList.add("ui-selected");
            }
        }
    });
}
// インデント処理
function changeIndent(isIncrease) {
    selectedRows.forEach(function (row) {
        var currentIndent = parseInt(row.style.textIndent) || 0;
        var newIndent = isIncrease ? currentIndent + indentPx : currentIndent - indentPx;
        if (newIndent >= 0 && newIndent <= 3 * indentPx) {
            row.style.textIndent = newIndent + "px";
        }
    });
}
// 日数計算
function calculateDuration(startDate, endDate) {
    //開始日を含むため、差を +1日 する
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
// 予定/実績開始日変更時のバー移動
function moveStartBar(taskId) {
    // バーの位置を計算し移動
    // 省略部分
}
// 予定/実績終了日変更時のバー移動
function moveEndBar(taskId) {
    // バーの位置を計算し移動
    // 省略部分
}
// 進捗率描画とバーの色を固定
function updateProgress(taskId, progress) {
    var planBar = document.getElementById("planBar_".concat(taskId));
    var progBar = document.getElementById("progBar_".concat(taskId));
    // 進捗バーの幅を計算
    var maxWidth = planBar.clientWidth;
    var newWidth = (progress / 100) * maxWidth;
    // バーの幅を設定
    progBar.style.width = "".concat(newWidth, "px");
    // バーの色を固定で設定
    progBar.style.backgroundColor = '#ffc135';
}
