import { default as CommonView, RactiveTemplate, On } from '../../common/CommonView';
import { AppChannel } from '../../services/radioService';

import MessageViewTmpl from './MessageView.html'

@RactiveTemplate(MessageViewTmpl)
class MessageView extends CommonView {
  initialize(opts) {
    this.opts = opts
  }

  templateContext() {
    return this.opts
  }

  @On()
  onClose() {
    this._hide()
    this.trigger('close')
  }

  @On()
  onAccept() {
    this._hide()
    this.trigger('accept')
  }

  @On()
  onReject() {
    this._hide()
    this.trigger('reject')
  }

  _hide() {
    AppChannel.request('hide:message')
  }
}

export default MessageView;
