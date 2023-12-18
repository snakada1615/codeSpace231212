// 全てのintefaceを読み込む
import * as models from './MyInterface'

// 定数のエクスポート
export const PI = 3.14
export const GRAVITY = 9.8

// 関数のエクスポート
export function add(x: number, y: number): number {
  return x + y
}

/*
 * ターゲットグループの構成とdri一蘭から栄養需要を計算する
 * @param target ターゲット構成[id, count]
 * @param dri
 * @returns {*}
 */
export function getNutritionDemand(target: models.TargetMembers, dri: models.DriItems) {
  const initObj = {
    En: 0,
    Pr: 0,
    Va: 0,
    Fe: 0
  }
  if (!target || target.length === 0) {
    return initObj
  }
  return target.reduce((accumulator, currentItem) => {
    const count = Number(currentItem.count)
    const driValue = dri.find((item) => item.id === currentItem.id)
    if (!driValue) {
      throw new Error('targetMember not matching...')
    }
    accumulator.En += count * Number(driValue.En)
    accumulator.Pr += count * Number(driValue.Pr)
    accumulator.Va += count * Number(driValue.Va)
    accumulator.Fe += count * Number(driValue.Fe)
    return accumulator
  }, initObj)
}
