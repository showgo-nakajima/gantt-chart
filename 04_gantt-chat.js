// 課題1 - クリックした行
var $selectedRow = null;
// 課題1 - 選択中行クラス名
var selectRow = "ui-selected";
// 課題2 - インデント幅
var indentPx = 12;
// 課題4 - 日付位置マップ
var datePositions = {};
// 課題5 - width step
var widAdd = 19;
// 初期表示時
$(function () {
    // CSS関連 - ヘッダー
    var element = document.querySelector('.column_header');
    // 横にスクロールした分、位置をずらす
    element.style.left = -window.pageXOffset + 'px';
    window.addEventListener('scroll', function () {
        element.style.left = -window.pageXOffset + 'px';
    });
    /* 課題1 */
    // 複数選択行入れ替え
    multiDrag($("#column_table_body"));
    /* 課題2 */
    // →インデント処理
    $("#indent_right").on('click', function () {
        if ($selectedRow !== null) {
            var indent = parseInt($selectedRow.css("text-indent") || "0") + indentPx;
            if (indent <= indentPx * 3)
                $selectedRow.css("text-indent", indent + "px");
        }
    });
    // ←インデント処理
    $("#indent_left").on('click', function () {
        if ($selectedRow !== null) {
            var indent = parseInt($selectedRow.css("text-indent") || "0") - indentPx;
            if (0 <= indent)
                $selectedRow.css("text-indent", indent + "px");
        }
    });
    /* 課題4 */
    // 日付ヘッダーリスト
    var $tarTr = $(".column_header tr:nth-child(2)");
    var dayLen = $(".column_header tr:nth-child(2) th").length;
    // 各ヘッダー位置をマップに設定
    for (var i = 13; i <= dayLen; i++) {
        var $dateTh = $($tarTr.children("th:nth-child(".concat(i, ")")));
        datePositions[$dateTh.attr("id") || ""] = $dateTh.position().left;
    }
});
// 課題1 - 複数選択ドラッグ
function multiDrag(elem) {
    $(elem).selectable({
        cancel: '.sort-handle, .ui-selected',
        // 移動後イベント
        selected: function (e, ui) {
            // 選択中行を格納
            $selectedRow = $("." + selectRow).children("td:nth-child(2)");
        },
    }).sortable({
        placeholder: "ui-state-highlight",
        axis: 'y',
        opacity: 0.9,
        items: "> tr",
        handle: 'td, .sort-handle, .ui-selected',
        helper: function (e, item) {
            if (!item.hasClass('ui-selected')) {
                item.parent().children('.ui-selected').removeClass('ui-selected');
                item.addClass('ui-selected');
            }
            var selected = item.parent().children('.ui-selected').clone();
            var ph = item.outerHeight() * selected.length;
            item.data('multidrag', selected).siblings('.ui-selected').remove();
            return $('<tr/>').append(selected);
        },
        cursor: "move",
        start: function (e, ui) {
            var ph = ui.placeholder.css('height');
        },
        stop: function (e, ui) {
            var selected = ui.item.data('multidrag');
            ui.item.after(selected);
            ui.item.remove();
            selected.removeClass('ui-selected');
            selected.children("td").removeClass('ui-selected');
        },
    });
}
// 課題3 - 日数計算
function calcDifDay(elem, isPlan) {
    var tar = isPlan ? "plan" : "act";
    var idx = getIdx(elem);
    var $planSt = $("#".concat(tar, "St_").concat(idx));
    var $planEd = $("#".concat(tar, "Ed_").concat(idx));
    if (!isEmpty($planSt.val()) && !isEmpty($planEd.val())) {
        var diff = diffDays(new Date($planEd.val()), new Date($planSt.val()));
        $("#".concat(tar, "Dif_").concat(idx)).text(diff);
    }
}
// 課題4 - 開始日変更時バー移動
function moveSt(elem, isPlan) {
    // 開始日
    var $st = elem;
    var idx = getIdx($st);
    // 移動位置
    var stPos = datePositions[$st.val()];
    // バー変更
    var tar = isPlan ? "plan" : "act";
    var $bar = $("#".concat(tar, "Bar_").concat(idx));
    $bar.css("left", "".concat(stPos, "px"));
    var $ed = $("#".concat(tar, "Ed_").concat(idx));
    var barPos = datePositions[$ed.val()];
    $bar.css("width", "".concat(barPos + widAdd - stPos, "px"));
}
// 課題5 - 終了日変更時バー幅変更
function moveEd(elem, isPlan) {
    // 終了日
    var $ed = elem;
    var idx = getIdx($ed);
    // 移動位置
    var barPos = datePositions[$ed.val()];
    // 開始日位置
    var tar = isPlan ? "plan" : "act";
    var $st = $("#".concat(tar, "St_").concat(idx));
    var stPos = datePositions[$st.val()];
    // バー変更
    var $bar = $("#".concat(tar, "Bar_").concat(idx));
    $bar.css("width", "".concat(barPos + widAdd - stPos, "px"));
}
// 課題6 - 進捗率描画
function updateProg(elem) {
    var idx = getIdx(elem);
    $("#progBar_".concat(idx)).css("width", "".concat(elem.value, "%"));
}
// -----------汎用処理-------------
// インデックス取得
function getIdx(elem) {
    var _a;
    return ((_a = $(elem).attr("id")) === null || _a === void 0 ? void 0 : _a.split("_")[1]) || '';
}
// 日付差
function diffDays(d1, d2) {
    var diffTime = d1.getTime() - d2.getTime();
    var diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return ++diffDay;
}
// 空文字チェック
function isEmpty(val) {
    return val == null || val === '';
}
