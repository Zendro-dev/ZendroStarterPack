<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'measurement'"><button class="ui primary button">Add measurement</button></router-link>
      <button class="ui primary button" @click="downloadExampleCsv">CSV Example Table</button>
      <router-link v-bind:to="'/measurements/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl()"
      :fields="fields"
      :per-page="20"
      :appendParams="moreParams"
      :http-options="{ headers: {Authorization: `Bearer ${this.$store.getters.authToken}`} }"
      pagination-path="data.vueTableMeasurement"
      detail-row-component="measurement-detail-row"
      data-path="data.vueTableMeasurement.data"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:load-error="onError"
    ></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'
import measurementCustomActions from './measurementCustomActions.vue'
import measurementDetailRow from './measurementDetailRow.vue'
import FilterBar from './FilterBar.vue'

import axios from 'axios'

import Vue from 'vue'
import VueEvents from 'vue-events'
Vue.use(VueEvents)

Vue.component('measurement-custom-actions', measurementCustomActions)
Vue.component('measurement-detail-row', measurementDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    measurementDetailRow
  },
  data() {
    return {
      fields: [{
          name: 'id',
          title: 'ID',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        // For now, we do not render checkboxes, as we yet have to provide
        // functions for selected rows.
        //{
        //  name: '__checkbox',
        //  titleClass: 'center aligned',
        //  dataClass: 'center aligned'
        //},
                  {
            name: 'method',
            sortField: 'method'
          },
                  {
            name: 'reference',
            sortField: 'reference'
          },
                  {
            name: 'float_value',
            sortField: 'float_value'
          },
                  {
            name: 'int_value',
            sortField: 'int_value'
          },
                  {
            name: 'text_value',
            sortField: 'text_value'
          },
                  {
            name: 'unit',
            sortField: 'unit'
          },
                {
          name: '__component:measurement-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {
        query: `{vueTableMeasurement{data {id  method reference float_value int_value text_value unit field_plot{field_name  coordinates_or_name }} total per_page current_page last_page prev_page_url next_page_url from to}}`
      }
    }
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: ', field.name)
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    onFilterSet(filterText) {
      this.moreParams [
        'filter'] = filterText.trim()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.moreParams = {
        query: `{vueTableMeasurement{data {id  method reference float_value int_value text_value unit field_plot{field_name  coordinates_or_name }} total per_page current_page last_page prev_page_url next_page_url from to}}`
      }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/measurements/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'

      axios.get(url).then(function (response) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'measurement' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    },
    downloadExampleCsv: function() {
      var t = this
      axios.get(t.$baseUrl() + '/measurements/example_csv', {
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'measurements.csv');
        document.body.appendChild(link);
        link.click();
      }).catch(res => {
        var err = (res && res.response && res.response.data && res.response
          .data.message ?
          res.response.data.message : res)
        t.$root.$emit('globalError', err)
        t.$router.push('/')
      })
    },
    onError: function(res) {
      var err = (res && res.response && res.response.data && res.response.data.message ?
        res.response.data.message : res)
      this.$root.$emit('globalError', err)
      this.$router.push('/')
    }
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  }
}
</script>
