class Booking {
  static get config() {
    return {
      filterParamName: 'nflt',                    // name of search param for filters
      filterContainerSelector: '#filterbox_wrap'  // container for filters on search page
    }
  }

  static getFiltersFromURL(url){
    const params = new URLSearchParams(url);
    return params.get(this.config.filterParamName);
  }

  static extendURLWithFilters(url, filters){
    const urlObj = new URL(url);
    urlObj.searchParams.set(this.config.filterParamName, filters);
    
    return `${urlObj.origin}${urlObj.pathname}?${urlObj.searchParams.toString()}`
  }
}



export default Booking
