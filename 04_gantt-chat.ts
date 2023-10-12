// 課題1 - クリックした行
let $selectedRow: JQuery<HTMLElement> | null = null;

// 課題1 - 選択中行クラス名
const selectRow: string = "ui-selected";

// 課題2 - インデント幅
const indentPx: number = 12;

// 課題4 - 日付位置マップ
let datePositions: { [id: string]: number } = {};

// 課題5 - width step
const widAdd: number = 19;

// 初期表示時
$(function() {
  // CSS関連 - ヘッダー
  const element = document.querySelector('.column_header') as HTMLElement;
  // 横にスクロールした分、位置をずらす
  element.style.left = -window.pageXOffset + 'px';
  window.addEventListener('scroll', () => {
    element.style.left = -window.pageXOffset + 'px';
  });

  /* 課題1 */
  // 複数選択行入れ替え
  multiDrag($("#column_table_body"));

  /* 課題2 */
  // →インデント処理
  $("#indent_right").on('click', function() {
    if ($selectedRow !== null) {
      let indent = parseInt($selectedRow.css("text-indent") || "0") + indentPx;
      if (indent <= indentPx * 3) $selectedRow.css("text-indent", indent + "px");
    }
  });
  // ←インデント処理
  $("#indent_left").on('click', function() {
    if ($selectedRow !== null) {
      let indent = parseInt($selectedRow.css("text-indent") || "0") - indentPx;
      if (0 <= indent) $selectedRow.css("text-indent", indent + "px");
    }
  });

  /* 課題4 */
  // 日付ヘッダーリスト
  const $tarTr = $(".column_header tr:nth-child(2)");
  const dayLen = $(".column_header tr:nth-child(2) th").length;
  // 各ヘッダー位置をマップに設定
  for (let i = 13; i <= dayLen; i++) {
    const $dateTh = $($tarTr.children(`th:nth-child(${i})`));
    datePositions[$dateTh.attr("id") || ""] = $dateTh.position().left;
  }
});

// 課題1 - 複数選択ドラッグ
function multiDrag(elem: JQuery<HTMLElement>) {
  $(elem).selectable({
    cancel: '.sort-handle, .ui-selected',
    // 移動後イベント
    selected: function(e, ui) {
      // 選択中行を格納
      $selectedRow = $("." + selectRow).children("td:nth-child(2)");
    },
  }).sortable({
    placeholder: "ui-state-highlight",
    axis: 'y',
    opacity: 0.9,
    items: "> tr",
    handle: 'td, .sort-handle, .ui-selected',
    helper: function(e, item) {
      if (!item.hasClass('ui-selected')) {
        item.parent().children('.ui-selected').removeClass('ui-selected');
        item.addClass('ui-selected');
      }
      const selected = item.parent().children('.ui-selected').clone();
      let ph = item.outerHeight() * selected.length;
      item.data('multidrag', selected).siblings('.ui-selected').remove();
      return $('<tr/>').append(selected);
    },
    cursor: "move",
    start: function(e, ui) {
      const ph = ui.placeholder.css('height');
    },
    stop: function(e, ui) {
      const selected = ui.item.data('multidrag');
      ui.item.after(selected);
      ui.item.remove();
      selected.removeClass('ui-selected');
      selected.children("td").removeClass('ui-selected');
    },
  });
}

// 課題3 - 日数計算
function calcDifDay(elem: JQuery<HTMLElement>, isPlan: boolean) {
  const tar = isPlan ? "plan" : "act";
  const idx = getIdx(elem);
  const $planSt = $(`#${tar}St_${idx}`);
  const $planEd = $(`#${tar}Ed_${idx}`);
  if (!isEmpty($planSt.val() as string) && !isEmpty($planEd.val() as string)) {
    const diff = diffDays(new Date($planEd.val() as string), new Date($planSt.val() as string));
    $(`#${tar}Dif_${idx}`).text(diff);
  }
}

// 課題4 - 開始日変更時バー移動
function moveSt(elem: JQuery<HTMLElement>, isPlan: boolean) {
  // 開始日
  const $st = elem;
  const idx = getIdx($st);
  // 移動位置
  const stPos = datePositions[$st.val() as string];
  // バー変更
  const tar = isPlan ? "plan" : "act";
  const $bar = $(`#${tar}Bar_${idx}`);
  $bar.css("left", `${stPos}px`);
  
  const $ed = $(`#${tar}Ed_${idx}`);
  const barPos = datePositions[$ed.val() as string];
  $bar.css("width", `${barPos + widAdd - stPos}px`);
}

// 課題5 - 終了日変更時バー幅変更
function moveEd(elem: JQuery<HTMLElement>, isPlan: boolean) {
  // 終了日
  const $ed = elem;
  const idx = getIdx($ed);
  // 移動位置
  const barPos = datePositions[$ed.val() as string];
  // 開始日位置
  const tar = isPlan ? "plan" : "act";
  const $st = $(`#${tar}St_${idx}`);
  const stPos = datePositions[$st.val() as string];
  // バー変更
  const $bar = $(`#${tar}Bar_${idx}`);
  $bar.css("width", `${barPos + widAdd - stPos}px`);
}

// 課題6 - 進捗率描画
function updateProg(elem: HTMLInputElement) {
  const idx = getIdx(elem);
  $(`#progBar_${idx}`).css("width", `${elem.value}%`);
}

// -----------汎用処理-------------
// インデックス取得
function getIdx(elem: HTMLElement) {
  return $(elem).attr("id")?.split("_")[1] || '';
}

// 日付差
function diffDays(d1: Date, d2: Date): number {
  const diffTime = d1.getTime() - d2.getTime();
  const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return ++diffDay;
}

// 空文字チェック
function isEmpty(val: string | null): boolean {
  return val == null || val === '';
}

