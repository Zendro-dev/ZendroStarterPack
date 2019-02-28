<template>
  <div class="sidenav">
    <a href="/home"> HOME </a>
        <a href='/breeding_pools'> breeding_pools   </a>
        <a href='/field_plots'> field_plots   </a>
        <a href='/genotypes'> genotypes   </a>
        <a href='/individuals'> individuals   </a>
        <a href='/marker_data'> marker_data   </a>
        <a href='/measurements'> measurements   </a>
        <a href='/nuc_acid_library_results'> nuc_acid_library_results   </a>
        <a href='/roles'> roles   </a>
        <a href='/samples'> samples   </a>
        <a href='/sequencing_experiments'> sequencing_experiments   </a>
        <a href='/transcript_counts'> transcript_counts   </a>
        <a href='/users'> users   </a>
      </div>
</template>

<script>

export default {
  name: 'side-nav'
}
</script>

<style>
.sidenav {
    text-align: left;
    height: 100%;
    width: 280px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #111;
    overflow-x: hidden;
    padding-top: 20px;
}
.sidenav a {
    padding: 6px 6px 6px 32px;
    text-decoration: none;
    color: #818181;
    display: block;
}
.sidenav a:hover {
    color: #f1f1f1;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>
