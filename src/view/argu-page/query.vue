<template>
  <div>
    <Card>
      <h2>ID: {{ $route.query.id }}</h2>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'query',
  mounted(){
    console.log('query: ', this.$route.query)
  }
}
</script>

<style>

</style>
