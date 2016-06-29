import page from 'page'

export default {
  redirect() {
    return page.redirect(...arguments)
  }
}
