// ナンバーリンクパズルのデータ
export const numberLinkPuzzles = [
  {
    name: 'シンプル',
    size: 5, // 5x5のグリッド
    numbers: [
      { value: 1, positions: [[0, 0], [2, 2]] }, // 数字1の開始位置と終了位置
      { value: 2, positions: [[1, 0], [1, 2]] }, // 数字2の開始位置と終了位置
      { value: 3, positions: [[0, 1], [2, 1]] }, // 数字3の開始位置と終了位置
    ]
  },
  {
    name: 'やさしい',
    size: 6,
    numbers: [
      { value: 1, positions: [[0, 0], [3, 3]] },
      { value: 2, positions: [[1, 1], [4, 1]] },
      { value: 3, positions: [[2, 0], [2, 4]] },
      { value: 4, positions: [[0, 2], [5, 2]] },
    ]
  }
];
