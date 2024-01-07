<script setup lang="ts">
import * as myVal from 'src/models/MyInterface'
import { type Ref, ref, computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'
import myFunc from 'src/models/MyFunctions'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItems>,
    required: true
  },
  fctFavoriteList: {
    type: Object as PropType<myVal.FctStars>,
    required: true
  }
})
</script>

<template>
  <q-card class="bg-grey-2 q-pa-sm">
    <!-- MenuTable -->
    <q-table
      class="my-sticky-header-table"
      :table-header-style="{ backgroundColor: 'DarkSeaGreen' }"
      flat
      bordered
      dense
      :rows="rowsFct"
      :columns="columnsFct"
      row-key="name"
      @row-click="onRowClick"
    >
      <template v-slot:body-cell-star="props">
        <q-td :props="props">
          <div>
            <q-icon :name="props.row.Star ? 'star' : 'star_border'" :color="'primary'"></q-icon>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>
