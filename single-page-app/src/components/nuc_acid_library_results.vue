<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'nuc_acid_library_result'"><button class="ui primary button">Add nuc_acid_library_result</button></router-link>
      <button class="ui primary button" @click="downloadExampleCsv">CSV Example Table</button>
      <router-link v-bind:to="'/nuc_acid_library_results/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl()"
      :fields="fields"
      :per-page="20"
      :appendParams="moreParams"
      :http-options="{ headers: {Authorization: `Bearer ${this.$store.getters.authToken}`} }"
      pagination-path="data.vueTableNuc_acid_library_result"
      detail-row-component="nuc_acid_library_result-detail-row"
      data-path="data.vueTableNuc_acid_library_result.data"
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
import nuc_acid_library_resultCustomActions from './nuc_acid_library_resultCustomActions.vue'
import nuc_acid_library_resultDetailRow from './nuc_acid_library_resultDetailRow.vue'
import FilterBar from './FilterBar.vue'

import axios from 'axios'

import Vue from 'vue'
import VueEvents from 'vue-events'
Vue.use(VueEvents)

Vue.component('nuc_acid_library_result-custom-actions', nuc_acid_library_resultCustomActions)
Vue.component('nuc_acid_library_result-detail-row', nuc_acid_library_resultDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    nuc_acid_library_resultDetailRow
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
            name: 'lab_code',
            sortField: 'lab_code'
          },
                  {
            name: 'file_name',
            sortField: 'file_name'
          },
                  {
            name: 'file_uri',
            sortField: 'file_uri'
          },
                  {
            name: 'type',
            sortField: 'type'
          },
                  {
            name: 'insert_size',
            sortField: 'insert_size'
          },
                  {
            name: 'technical_replicate',
            sortField: 'technical_replicate'
          },
                  {
            name: 'trimmed',
            sortField: 'trimmed'
          },
                {
          name: '__component:nuc_acid_library_result-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {
        query: `{vueTableNuc_acid_library_result{data {id  lab_code file_name file_uri type insert_size technical_replicate trimmed sample{name  tissue }} total per_page current_page last_page prev_page_url next_page_url from to}}`
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
        query: `{vueTableNuc_acid_library_result{data {id  lab_code file_name file_uri type insert_size technical_replicate trimmed sample{name  tissue }} total per_page current_page last_page prev_page_url next_page_url from to}}`
      }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/nuc_acid_library_results/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'

      axios.get(url).then(function (response) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'nuc_acid_library_result' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    },
    downloadExampleCsv: function() {
      var t = this
      axios.get(t.$baseUrl() + '/nuc_acid_library_results/example_csv', {
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'nuc_acid_library_results.csv');
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
