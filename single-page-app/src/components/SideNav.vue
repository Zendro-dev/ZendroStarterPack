<template>
  <div class="sidenav">
    <a href="/home"> HOME </a>
        <a href='/beedingpools'> BeedingPools   </a>
        <a href='/fieldplots'> FieldPlots   </a>
        <a href='/genotypes'> Genotypes   </a>
        <a href='/individuals'> Individuals   </a>
        <a href='/markerdata'> MarkerData   </a>
        <a href='/measurements'> Measurements   </a>
        <a href='/nucacidlibraryresults'> NucAcidLibraryResults   </a>
        <a href='/samples'> Samples   </a>
        <a href='/sequencingexperiments'> SequencingExperiments   </a>
        <a href='/transcriptcounts'> TranscriptCounts   </a>
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
