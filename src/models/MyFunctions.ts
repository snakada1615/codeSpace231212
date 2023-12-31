// 全てのintefaceを読み込む
import * as models from './MyInterface'

// 定数のエクスポート
export const PI = 3.14
export const GRAVITY = 9.8

// 関数のエクスポート
export function add(x: number, y: number): number {
  return x + y
}

export class myFunc {
  /*
   * ターゲットグループの構成とdri一蘭から栄養需要を計算する
   * @param target ターゲット構成[id, count]
   * @param dri
   * @returns {*}
   */
  getNutritionDemand(target: models.TargetMembers, dri: models.DriItems) {
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
}
