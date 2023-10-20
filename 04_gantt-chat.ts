interface GanttChartRow {
  id: number;
  taskName: string;
}

const ganttChartRows: GanttChartRow[] = [
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

const selectedRows: HTMLElement[] = [];
const indentPx: number = 12;
const datePositions: Record<string, Date> = {};
const widAdd: number = 19;

function calculateAndDisplayDuration(): void {
  ganttChartRows.forEach((row) => {
    const taskId: number = row.id;
    const planStartDateInput: HTMLInputElement | null = document.getElementById(`planSt_${taskId}`);
    const planEndDateInput: HTMLInputElement | null = document.getElementById(`planEd_${taskId}`);
    const actStartDateInput: HTMLInputElement | null = document.getElementById(`actSt_${taskId}`);
    const actEndDateInput: HTMLInputElement | null = document.getElementById(`actEd_${taskId}`);
    const planDurationCell: HTMLElement | null = document.getElementById(`planDif_${taskId}`);
    const actDurationCell: HTMLElement | null = document.getElementById(`actDif_${taskId}`);

    if (planStartDateInput && planEndDateInput && planDurationCell) {
      const planStartDate: Date = new Date(planStartDateInput.value);
      const planEndDate: Date = new Date(planEndDateInput.value);
      const planDuration: number = calculateInclusiveDuration(planStartDate, planEndDate);
      planDurationCell.textContent = planDuration.toString();
    }

    if (actStartDateInput && actEndDateInput && actDurationCell) {
      const actStartDate: Date = new Date(actStartDateInput.value);
      const actEndDate: Date = new Date(actEndDateInput.value);
      const actDuration: number = calculateInclusiveDuration(actStartDate, actEndDate);
      actDurationCell.textContent = actDuration.toString();
    }
  });
}

function calculateInclusiveDuration(startDate: Date, endDate: Date): number {
  const inclusiveEndDate: Date = new Date(endDate);
  inclusiveEndDate.setDate(endDate.getDate() + 1);
  const durationInMilliseconds: number = inclusiveEndDate.getTime() - startDate.getTime();
  const durationInDays: number = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
  return durationInDays;
}

function attachDateChangeListeners(): void {
  ganttChartRows.forEach((row) => {
    const taskId: number = row.id;
    const planStartDateInput: HTMLInputElement | null = document.getElementById(`planSt_${taskId}`);
    const planEndDateInput: HTMLInputElement | null = document.getElementById(`planEd_${taskId}`);
    const actStartDateInput: HTMLInputElement | null = document.getElementById(`actSt_${taskId}`);
    const actEndDateInput: HTMLInputElement | null = document.getElementById(`actEd_${taskId}`);

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

document.addEventListener("DOMContentLoaded", () => {
  // クリック行着色
  selected(document.getElementById("column_table_body"));

  // 左右button のイベントリスナーを設定
  const indentRightButton: HTMLElement | null = document.getElementById('indent_right');
  const indentLeftButton: HTMLElement | null = document.getElementById('indent_left');

  //右インデントボタンのクイックリスナー
  indentRightButton?.addEventListener('click', () => {
    changeIndent(true);
  });

  //左インデントボタンのクイックリスナー
  indentLeftButton?.addEventListener('click', () => {
    changeIndent(false);
  });

  //日付入力フィールドの変更リスナー
  document.querySelectorAll('.dateInpt').forEach((element) => {
    element.addEventListener('change', (event) => {
      const taskId: number = Number((event.target as HTMLElement).id.split('_')[1]);
      updateDateDifference(taskId);
    });
  });

  //開始日付入力フィールドの変更リスナー
  document.querySelectorAll('.actSt').forEach((element) => {
    element.addEventListener('change', (event) => {
      const taskId: number = Number((event.target as HTMLElement).id.split('_')[1]);
      moveStartBar(taskId);
    });
  });

  //終了日付入力フィールドの変更リスナー
  document.querySelectorAll('.actEd').forEach((element) => {
    element.addEventListener('change', (event) => {
      const taskId: number = Number((event.target as HTMLElement).id.split('_')[1]);
      moveEndBar(taskId);
    });
  });

  //プログレスバーの変更リスナー
  document.querySelectorAll('.prog').forEach((element) => {
    element.addEventListener('input', (event) => {
      const taskId: number = Number((event.target as HTMLElement).id.split('_')[1]);
      const progress: number = Number((event.target as HTMLInputElement).value);
      updateProgress(taskId, progress);
    });
  });
});

/*
一応下記も残しておく（バックアップの為）141~157
*/
// 行を選択した際の処理
// function selected(elem: HTMLElement): void {
//   elem.addEventListener("click", (event) => {
//     const target: HTMLElement = event.target as HTMLElement;

//     // クリックされた要素が 'TD' タグであることを確認し、親要素が存在する場合
//     if (target.tagName === "TD" && target.parentElement) {
//       const row: HTMLElement = target.parentElement;
//       const secondTD_1: HTMLElement | null = row.querySelector("td:nth-child(2)");
//       const TR: NodeListOf<HTMLElement> = row.querySelectorAll("td");

//       selectedRows.forEach((selectedTD) => selectedTD.classList.remove("ui-selected"));
//       selectedRows = [secondTD_1];
//       TR.forEach((td) => td.classList.add("ui-selected"));
//     }
//   });
// }

// 行を選択した際の処理
// 行を選択した際の処理
function selected(elem: HTMLElement): void {
 elem.addEventListener("click", (event) => {
   const target: HTMLElement = event.target as HTMLElement;

   // クリックされた要素が 'TD' タグであることを確認し、親要素が存在する場合
   if (target.tagName === "TD" && target.parentElement) {
     const row: HTMLElement = target.parentElement;
     const secondTD_1: HTMLElement | null = row.querySelector("td:nth-child(2)");
     const TR: NodeListOf<HTMLElement> = row.querySelectorAll("td");

     if (!event.ctrlKey) {
       // Ctrlキーが押されていない場合、一旦すべての行から "ui-selected" クラスを削除
       const allRows: NodeListOf<HTMLElement> = document.querySelectorAll("tr");
       allRows.forEach((r) => r.querySelectorAll("td.ui-selected").forEach((td) => td.classList.remove("ui-selected"));

       // Ctrlキーが押されていない場合、選択された行を空にする
       selectedRows = [];
     }

     // クリックされた行に "ui-selected" クラスを追加
     TR.forEach((td) => td.classList.add("ui-selected"));

     // クリックされた行の情報を selectedRows に追加
     selectedRows.push(secondTD_1);
   }
 });
}

// インデント（行のレベル）を変更する関数
function changeIndent(isIncrease: boolean) {
 selectedRows.forEach((row) => {
   const currentIndent = parseInt(row.style.textIndent) || 0; // 現在のインデントを取得（ない場合は 0）
   if (!isNaN(currentIndent)) {
     // 現在のインデントが数値である場合
     const newIndent = isIncrease ? currentIndent + indentPx : currentIndent - indentPx; // 新しいインデントを計算
     if (newIndent >= 0 && newIndent <= 3 * indentPx) {
       // 新しいインデントが許容範囲内である場合
       row.style.textIndent = newIndent + "px"; // 新しいインデントを設定
     }
   }
 });
}


// 親の 'TR' 要素を検索する関数
function findParentTR(element: HTMLElement): HTMLElement | null {
  while (element && element.tagName !== "TR") {
    element = element.parentElement as HTMLElement;
  }
  return element;
}

// 行選択時の処理
function selectRow(target: HTMLElement): void {
  const row: HTMLElement | null = findParentTR(target);

  if (!row) {
    return;
  }

  const allRows = tbody?.querySelectorAll('tr.ui-selected');
  allRows?.forEach((tr) => {
    tr.classList.remove("ui-selected");
  });

  // 選択された行に ui-selected クラスを追加
  row.classList.add("ui-selected");
}

//インデント（行のレベル）を変更する関数
//行を選択した際の処理
function selected(elem: HTMLElement): void{
 elem.addEventListener('click', (event) => {
  const target: HTMLElement = event.target as HTMLElement;

  //クリックされた要素がTDであり、かつ親要素（TR)が存在する場合
  if (target.tagName === "TD" && target.parentElement) {
   const row: HTMLElement = target.parentElement;
   const secondTD_1: HTMLElement | nul = row.querySelector('td:nth-child(2)');
   const TR: NodeListOf<HTMLElement> = row.querySelectorAll('td');

   if (!event.ctrlKey) {
    //Ctrlが押されていない場合、一旦全ての行から "ui-selected" クラスを削除
    const allRows: NodeListOf<HTMLElement> = document.querySelectorAll("tr");
    allRows.forEach((r) => r.querySelectorAll("td.ui-selected").forEach((td) => td.classList.remove("ui-selected")));

    //Ctrlキーが押されなかった場合、選択された行を解除
    selectedRows = [];
   }
   //クリックされた行に"ui-selected"クラスを追加
   TR.forEach((td) => td.classList.add("ui-selected"));
   //クリックされた行の情報を selectedRows に追加
   selectedRows.push(secondTD_1);
   console.log(selectedRows);
  }
 })
}

//時間換算
function calculateDuration(startDate: Date, endDate: Date): number {
  const durationInMilliseconds = endDate.getTime() - startDate.getTime() + 24 * 60 * 60 * 1000;
  const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
  return durationInDays;
}

//日付の差分を計算し、表示を更新する関数
function updateDateDifference(taskId: number): void {
  const task = ganttChartRows.find((row) => row.id === taskId);
  const planStartDateInput = document.getElementById(`planSt_${taskId}`) as HTMLInputElement;
  const planEndDateInput = document.getElementById(`planEd_${taskId}`) as HTMLInputElement;
  const actStartDateInput = document.getElementById(`actSt_${taskId}`) as HTMLInputElement;
  const actEndDateInput = document.getElementById(`actEd_${taskId}`) as HTMLInputElement;

  const planDurationCell = document.getElementById(`planDif_${taskId}`) as HTMLElement;
  const actDurationCell = document.getElementById(`actDif_${taskId}`) as HTMLElement;

  const planStartDate = new Date(planStartDateInput.value);
  const planEndDate = new Date(planEndDateInput.value);
  const actStartDate = new Date(actStartDateInput.value);
  const actEndDate = new Date(actEndDateInput.value);

  const planDateDifference = calculateDuration(planStartDate, planEndDate);
  const actDateDifference = calculateDuration(actStartDate, actEndDate);

  // 日数がNaNの場合、0に設定
  if (isNaN(planDateDifference)) {
    planDurationCell.textContent = '0';
  } else {
    // 日数が0未満の場合、0に設定
    if (planDateDifference <= 0) {
      alert("日数は0未満にすることはできません。");
      planDurationCell.textContent = '0';
      planStartDateInput.value = "";
      planEndDateInput.value = "";
    } else {
      planDurationCell.textContent = planDateDifference.toString();
    }
  }

  // 同様に実績の日数も処理
  if (isNaN(actDateDifference)) {
    actDurationCell.textContent = '0';
  } else {
    if (actDateDifference <= 0) {
      alert("日数は0未満にすることはできません.");
      actDurationCell.textContent = '0';
      actStartDateInput.value = "";
      actEndDateInput.value = "";
    } else {
      actDurationCell.textContent = actDateDifference.toString();
    }
  }
}


function moveStartBar(taskId: number): void {
  // バーの位置を計算し移動
}

function moveEndBar(taskId: number): void {
  // バーの位置を計算し移動
}

//バーが伸びたり縮んだりする処理
function updateProgress(taskId: number, progress: number): void {
  const planBar = document.getElementById(`planBar_${taskId}`);
  const progBar = document.getElementById(`progBar_${taskId}`);
  const maxWidth = planBar?.clientWidth || 0;
  const newWidth = (progress / 100) * maxWidth;
  if (progBar) {
    progBar.style.width = `${newWidth}px`;
    progBar.style.backgroundColor = '#ffc135';
  }
}

const tbody: HTMLElement | null = document.getElementById('column_table_body');
let draggedRow: HTMLTableRowElement | null = null;

function handleDragStart(this: HTMLTableRowElement, e: DragEvent): void {
  draggedRow = this;
  startY = e.clientY;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  e.stopPropagation();
}

function handleDragOver(e: DragEvent): boolean {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  if (draggedRow) {
    const currentY = e.clientY;
    if (startY !== null) { // startY が null でないかを確認
      const deltaY = currentY - startY;
      // 垂直ドラッグか水平ドラッグかを判定
      if (Math.abs(deltaY) > 5) {
        // 垂直ドラッグの場合は行の入れ替え
        e.stopPropagation();
      } else {
        // 水平ドラッグの場合はプログレスバーの処理
        e.preventDefault();
      }
    }
  }
  return false;
}

function handleDragEnter(this: HTMLElement, e: DragEvent): void {
  this.classList.add('over');
}

function handleDragLeave(this: HTMLElement, e: DragEvent): void {
  this.classList.remove('over');
}

function handleDrop(this: HTMLTableRowElement, e: DragEvent): boolean {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (draggedRow !== this) {
    tbody?.insertBefore(draggedRow, this);
  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(this: HTMLTableRowElement): void {
  this.classList.remove('over');
  draggedRow = null;
}

const rows: NodeListOf<HTMLTableRowElement> | null = tbody?.querySelectorAll('tr');
if (rows) {
  rows.forEach((row) => {
    row.draggable = true;
    row.addEventListener('dragstart', handleDragStart);
    row.addEventListener('dragover', handleDragOver);
    row.addEventListener('dragenter', handleDragEnter);
    row.addEventListener('dragleave', handleDragLeave);
    row.addEventListener('drop', handleDrop);
    row.addEventListener('dragend', handleDragEnd);
  });
}
