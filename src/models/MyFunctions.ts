// 全てのintefaceを読み込む
import * as models from './MyInterface'

// 定数のエクスポート
export const PI = 3.14
export const GRAVITY = 9.8

// 関数のエクスポート
export function add(x: number, y: number): number {
  return x + y
}

export default class myFunc {
  /*
   * ターゲットグループの構成とdri一蘭から栄養需要を計算する
   * @param target ターゲット構成[id, count]
   * @param dri
   * @returns {*}
   */
  static getNutritionDemand(target: models.TargetMembers, dri: models.DriItems) {
    const initObj = [
      { key: 'En', value: 0, label: 'Energy' },
      { key: 'Pr', value: 0, label: 'Protein' },
      { key: 'Va', value: 0, label: 'Vit-A' },
      { key: 'Fe', value: 0, label: 'Iron' }
    ]
    if (!target || target.length === 0) {
      return initObj
    }
    return target.reduce((accumulator, currentItem) => {
      const count = Number(currentItem.count)
      const driValue = dri.find((item) => item.id === currentItem.targetId)
      if (!driValue) {
        throw new Error('targetMember not matching...')
      }
      accumulator[0].value += count * Number(driValue.En)
      accumulator[1].value += count * Number(driValue.Pr)
      accumulator[2].value += count * Number(driValue.Va)
      accumulator[3].value += count * Number(driValue.Fe)
      return accumulator
    }, initObj)
  }

  // 配列から一意の値を抽出
  static uniq<T>(array: Array<T>): Array<T> {
    return Array.from(new Set(array))
  }

  /**
   * 数字の桁数を３桁に自動調整し、単位を追記して返す
   * unitkey [0..3]
   * @param val
   * @param unitKey
   * @returns {string}
   */

  static setDigit(val: number, unitKey: number) {
    let res
    const units = [
      { 1: ' KC', 2: ' MC', 3: ' GC' }, // for dietary energy
      { 1: ' g', 2: ' kg', 3: ' t' }, // for protein
      { 1: ' µg', 2: ' mg', 3: ' g' }, // for vit-A
      { 1: ' mg', 2: ' g', 3: ' kt' } // for iron
    ]
    const item = Number(val || 0)
    switch (true) {
      case item < 1000:
        res = String(Math.round(item)) + units[unitKey]['1']
        break
      case item >= 1000 && item < 1000000:
        res = String(Math.round(item / 1000)) + units[unitKey]['2']
        break
      case item >= 1000000:
        res = String(Math.round(item / 1000000)) + units[unitKey]['3']
        break
      default:
        console.log('parameter not valid:setDigit')
        res = String(item)
        break
    }
    return res
  }
}
