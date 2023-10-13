// ガントチャート行のデータを定義
interface GanttChartRow {
  id: number;
  taskName: string;
  // 他のプロパティ
}

const ganttChartRows: GanttChartRow[] = [
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
let selectedRows: HTMLElement[] = [];
const indentPx = 12;
const datePositions: { [key: string]: number } = {};
const widAdd = 19;


// 日数計算とセルへの表示を行う関数
function calculateAndDisplayDuration() {
  ganttChartRows.forEach((row) => {
      const taskId = row.id;
      const planStartDateInput = document.getElementById(`planSt_${taskId}`) as HTMLInputElement;
      const planEndDateInput = document.getElementById(`planEd_${taskId}`) as HTMLInputElement;
      const actStartDateInput = document.getElementById(`actSt_${taskId}`) as HTMLInputElement;
      const actEndDateInput = document.getElementById(`actEd_${taskId}`) as HTMLInputElement;
      const planDurationCell = document.getElementById(`planDif_${taskId}`);
      const actDurationCell = document.getElementById(`actDif_${taskId}`);

      if (planStartDateInput && planEndDateInput && planDurationCell) {
          const planStartDate = new Date(planStartDateInput.value);
          const planEndDate = new Date(planEndDateInput.value);
          const planDuration = calculateInclusiveDuration(planStartDate, planEndDate);
          planDurationCell.textContent = planDuration.toString();
      }

      if (actStartDateInput && actEndDateInput && actDurationCell) {
          const actStartDate = new Date(actStartDateInput.value);
          const actEndDate = new Date(actEndDateInput.value);
          const actDuration = calculateInclusiveDuration(actStartDate, actEndDate);
          actDurationCell.textContent = actDuration.toString();
      }
  });
}

// 開始日と終了日を含む日数を計算する関数
function calculateInclusiveDuration(startDate: Date, endDate: Date) {
  // 開始日を含めるため、1日を追加してから日数を計算
  const inclusiveEndDate = new Date(endDate);
  inclusiveEndDate.setDate(endDate.getDate() + 1);
  const durationInMilliseconds = inclusiveEndDate.getTime() - startDate.getTime();
  const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
  return durationInDays;
}


// 予定開始日・終了日、実績開始日・終了日の変更イベントに関連付ける
function attachDateChangeListeners() {
  ganttChartRows.forEach((row) => {
      const taskId = row.id;
      const planStartDateInput = document.getElementById(`planSt_${taskId}`) as HTMLInputElement;
      const planEndDateInput = document.getElementById(`planEd_${taskId}`) as HTMLInputElement;
      const actStartDateInput = document.getElementById(`actSt_${taskId}`) as HTMLInputElement;
      const actEndDateInput = document.getElementById(`actEd_${taskId}`) as HTMLInputElement;

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
  // CSS関連の処理は省略

  // 複数選択行入れ替え
  multiDrag(document.getElementById("column_table_body"));

  // その他のイベントリスナーを設定
  // →インデント処理のイベントリスナー
  document.getElementById('indent_right')?.addEventListener('click', () => {
      changeIndent(true);
  });

  // ←インデント処理のイベントリスナー
  document.getElementById('indent_left')?.addEventListener('click', () => {
      changeIndent(false);
  });

  // 日数計算のイベントリスナー
  document.querySelectorAll('.dateInpt').forEach((element) => {
      element.addEventListener('change', (event) => {
          const taskId = Number(event.target.id.split('_')[1]);
          updateDateDifference(taskId);
      });
  });

  // 予定/実績開始日変更時のバー移動のイベントリスナー
  document.querySelectorAll('.actSt').forEach((element) => {
      element.addEventListener('change', (event) => {
          const taskId = Number(event.target.id.split('_')[1]);
          moveStartBar(taskId);
      });
  });

  // 予定/実績終了日変更時のバー移動のイベントリスナー
  document.querySelectorAll('.actEd').forEach((element) => {
      element.addEventListener('change', (event) => {
          const taskId = Number(event.target.id.split('_')[1]);
          moveEndBar(taskId);
      });
  });

  // 進捗率描画のイベントリスナー
  document.querySelectorAll('.prog').forEach((element) => {
      element.addEventListener('input', (event) => {
          const taskId = Number(event.target.id.split('_')[1]);
          const progress = Number((<HTMLInputElement>event.target).value);
          updateProgress(taskId, progress);
      });
  });
});

// 複数選択行入れ替え
function multiDrag(elem: HTMLElement) {
  elem.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName === "TD" && target.parentElement) {
      const row = target.parentElement;
      const secondTD = row.querySelector("td:nth-child(2)");

      if (event.ctrlKey) {
        if (!selectedRows.includes(secondTD)) {
          secondTD.classList.add("ui-selected");
          selectedRows.push(secondTD);
        } else {
          secondTD.classList.remove("ui-selected");
          selectedRows = selectedRows.filter((selectedTD) => selectedTD !== secondTD);
        }
      } else {
        selectedRows.forEach((selectedTD) => selectedTD.classList.remove("ui-selected"));
        selectedRows = [secondTD];
        secondTD.classList.add("ui-selected");
      }
    }
  });
}

// インデント処理
function changeIndent(isIncrease: boolean) {
  selectedRows.forEach(row => {
      const currentIndent = parseInt(row.style.textIndent) || 0;
      const newIndent = isIncrease ? currentIndent + indentPx : currentIndent - indentPx;
      if (newIndent >= 0 && newIndent <= 3 * indentPx) {
          row.style.textIndent = newIndent + "px";
      }
  });
}

// 日数計算
function calculateDuration(startDate: Date, endDate: Date) {
  //開始日を含むため、差を +1日 する
  const durationInMilliseconds = endDate.getTime() - startDate.getTime() + 24 * 60 * 60 * 1000;
  const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
  return durationInDays;
}

function updateDateDifference(taskId: number) {
  const task = ganttChartRows.find((row) => row.id === taskId);
  const planStartDate = new Date((<HTMLInputElement>document.getElementById(`planSt_${taskId}`)).value);
  const planEndDate = new Date((<HTMLInputElement>document.getElementById(`planEd_${taskId}`)).value);
  const actStartDate = new Date((<HTMLInputElement>document.getElementById(`actSt_${taskId}`)).value);
  const actEndDate = new Date((<HTMLInputElement>document.getElementById(`actEd_${taskId}`)).value);

  const planDateDifference = calculateDuration(planStartDate, planEndDate);
  const actDateDifference = calculateDuration(actStartDate, actEndDate);

  (<HTMLTableCellElement>document.getElementById(`planDif_${taskId}`)).textContent = planDateDifference.toString();
  (<HTMLTableCellElement>document.getElementById(`actDif_${taskId}`)).textContent = actDateDifference.toString();
}

// 予定/実績開始日変更時のバー移動
function moveStartBar(taskId: number) {
  // バーの位置を計算し移動
  // 省略部分
}

// 予定/実績終了日変更時のバー移動
function moveEndBar(taskId: number) {
  // バーの位置を計算し移動
  // 省略部分
}

// 進捗率描画とバーの色を固定
function updateProgress(taskId: number, progress: number) {
  const planBar = document.getElementById(`planBar_${taskId}`) as HTMLDivElement;
  const progBar = document.getElementById(`progBar_${taskId}`) as HTMLDivElement;

  // 進捗バーの幅を計算
  const maxWidth = planBar.clientWidth;
  const newWidth = (progress / 100) * maxWidth;

  // バーの幅を設定
  progBar.style.width = `${newWidth}px`;

  // バーの色を固定で設定
  progBar.style.backgroundColor = '#ffc135';
}
