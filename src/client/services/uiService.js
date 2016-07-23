import Ractive from '../common/lib/ractive';

export default Ractive.extend({
  template: `
  {{#overlay}}
    <div id="ui-overlay" class="overlay fade {{#in}}in{{/in}}"></div>
  {{/overlay}}
  <div id="ui-modal"></div>
  `
})
