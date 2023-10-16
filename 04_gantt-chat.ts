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

  // その他のイベントリスナーを設定
  const indentRightButton: HTMLElement | null = document.getElementById('indent_right');
  const indentLeftButton: HTMLElement | null = document.getElementById('indent_left');

  indentRightButton?.addEventListener('click', () => {
      changeIndent(true);
  });

  indentLeftButton?.addEventListener('click', () => {
      changeIndent(false);
  });

  document.querySelectorAll('.dateInpt').forEach((element) => {
      element.addEventListener('change', (event) => {
          const taskId: number = Number(event.target.id.split('_')[1]);
          updateDateDifference(taskId);
      });
  });

  document.querySelectorAll('.actSt').forEach((element) => {
      element.addEventListener('change', (event) => {
          const taskId: number = Number(event.target.id.split('_')[1]);
          moveStartBar(taskId);
      });
  });

  document.querySelectorAll('.actEd').forEach((element) => {
      element.addEventListener('change', (event) => {
          const taskId: number = Number(event.target.id.split('_')[1]);
          moveEndBar(taskId);
      });
  });

  document.querySelectorAll('.prog').forEach((element) => {
      element.addEventListener('input', (event) => {
          const taskId: number = Number(event.target.id.split('_')[1]);
          const progress: number = Number(event.target.value);
          updateProgress(taskId, progress);
      });
  });
});

//行選択時の処理
function selected(elem: HTMLElement): void {
  elem.addEventListener("click", (event) => {
      const target: HTMLElement = event.target as HTMLElement;

      if (target.tagName === "TD" && target.parentElement) {
          const row: HTMLElement = target.parentElement;
          const secondTD_1: HTMLElement | null = row.querySelector("td:nth-child(2)");
          const AllTD: NodeListOf<HTMLElement> = row.querySelectorAll("td");

          if (event.ctrlKey) {
              if (!selectedRows.includes(secondTD_1)) {
                  AllTD.forEach((td) => td.classList.add("ui-selected"));
                  selectedRows.push(AllTD);
              } else {
                  AllTD.forEach((td) => td.classList.remove("ui-selected"));
                  selectedRows = selectedRows.filter((selectedTD) => selectedTD !== secondTD_1);
              }
          } else {
              selectedRows.forEach((selectedTD) => selectedTD.classList.remove("ui-selected"));
              selectedRows = [secondTD_1];
              AllTD.forEach((td) => td.classList.add("ui-selected");
          }
      }
  });
}

function findParentTR(element: HTMLElement): HTMLElement | null {
  while (element && element.tagName !== "TR") {
      element = element.parentElement as HTMLElement;
  }
  return element;
}

function selectRow(target: HTMLElement): void {
  const row: HTMLElement | null = findParentTR(target);

  if (!row) {
      return;
  }

  if (event.ctrlKey) {
      if (!selectedRows.includes(row)) {
          row.classList.add("ui-selected");
          selectedRows.push(row);
      } else {
          row.classList.remove("ui-selected");
          selectedRows = selectedRows.filter((selectedRow) => selectedRow !== row);
      }
  } else {
      selectedRows.forEach((selectedRow) => selectedRow.classList.remove("ui-selected"));
      selectedRows = [row];
      row.classList.add("ui-selected");
  }
}

function changeIndent(isIncrease: boolean) {
  selectedRows.forEach((row) => {
      const currentIndent = parseInt(row.style.textIndent) || 0;
      if (!isNaN(currentIndent)) {
          const newIndent = isIncrease ? currentIndent + indentPx : currentIndent - indentPx;
          if (newIndent >= 0 && newIndent <= 3 * indentPx) {
              row.style.textIndent = newIndent + "px";
          }
      }
  });
}

function calculateDuration(startDate: Date, endDate: Date): number {
  const durationInMilliseconds = endDate.getTime() - startDate.getTime() + 24 * 60 * 60 * 1000;
  const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
  return durationInDays;
}

function updateDateDifference(taskId: number): void {
  const task = ganttChartRows.find((row) => row.id === taskId);
  const planStartDate = new Date(document.getElementById(`planSt_${taskId}`).value);
  const planEndDate = new Date(document.getElementById(`planEd_${taskId}`).value);
  const actStartDate = new Date(document.getElementById(`actSt_${taskId}`).value);
  const actEndDate = new Date(document.getElementById(`actEd_${taskId}`).value);
  const planDateDifference = calculateDuration(planStartDate, planEndDate);
  const actDateDifference = calculateDuration(actStartDate, actEndDate);
  document.getElementById(`planDif_${taskId}`).textContent = planDateDifference.toString();
  document.getElementById(`actDif_${taskId}`).textContent = actDateDifference.toString();
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
  const maxWidth = planBar.clientWidth;
  const newWidth = (progress / 100) * maxWidth;
  progBar.style.width = `${newWidth}px`;
  progBar.style.backgroundColor = '#ffc135';
}

const tbody: HTMLElement | null = document.getElementById('column_table_body');
const draggedRow: HTMLTableRowElement | null = null;

function handleDragStart(this: HTMLTableRowElement, e: DragEvent): void {
  draggedRow = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e: DragEvent): boolean {
  if (e.preventDefault) {
      e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
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
      tbody.insertBefore(draggedRow, this);
  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(this: HTMLTableRowElement): void {
  this.classList.remove('over');
  draggedRow = null;
}

const rows: NodeListOf<HTMLTableRowElement> = tbody?.querySelectorAll('tr');
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
