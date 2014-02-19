'use strict';

(function() {
  var SearchHighlight = window.SearchHighlight = {
    className: 'search-highlight',
    inlineNodes: ['strong'],
    excludeNodes: ['aside', 'input', 'label'],
    isExclude: function(node) {
      return node &&
        this.excludeNodes.indexOf(node.tagName.toLowerCase()) > -1;
    },
    isInline: function(node) {
      return node && node.nodeType === Node.ELEMENT_NODE &&
        this.inlineNodes.indexOf(node.tagName.toLowerCase()) > -1;
    },
    split: function(match, offset, data) {
      var relativeOffset = offset - this.retreiveLength;
      var nextChild = this.child.splitText(relativeOffset);
      this.retreiveLength += this.child.length + match.length;
      nextChild.data = nextChild.data.slice(match.length);
      this.transform.call(this, nextChild, match);
      this.child = nextChild;
    },
    match: function(node, regexp) {
      this.child = node.firstChild;
      if (!this.child) {
        return;
      }
      do {
        switch (this.child.nodeType) {
          case Node.ELEMENT_NODE:
            if (this.isExclude(this.child)) {
              continue;
            } else if(this.isInline(this.child)) {
              var terms = regexp.source;
              var inlineContent = this.child.textContent;
              var inline = this.child;
              this.child = this.child.nextSibling;

              // Test w/ beginning
              var restContent = terms.match(
                  new RegExp('^' + inlineContent + '(.*)', 'i'));
              // Test w/ end of inline content
              var firstTerm = terms.split(' ', 1)[0];
              var otherTerms = terms.match(
                  new RegExp('^' + firstTerm + '(.*)', 'i'))[0];
              console.log('OtherTerms', otherTerms);
              var inlineEndWithFirstTerm = firstTerm.match(
                  new RegExp(inlineContent + '$', 'i'));
              var nextBeginWithOtherTerms = otherTerms.match(
                  new RegExp('^' + this.child.data, 'i'));

              // Beginning
              if (terms.length > inlineContent.length && restContent) {
                if (this.child.data.match(
                      new RegExp('^' + restContent[1], 'i'))) {
                  var span = document.createElement('span');
                  span.className = this.className;
                  span.appendChild(inline);
                  // next node please
                  var offset = restContent[1].length;
                  var nextChild = this.child.splitText(offset);
                  span.appendChild(this.child);
                  nextChild.parentNode.insertBefore(span, nextChild);
                  this.child = this.child.nextSibling;
                  continue;
                }
              } else if (inlineEndWithFirstTerm && nextBeginWithOtherTerms) {
                // Split and test with the end of the node
                console.log('Diff for end of strong', firstTerm, otherTerms);
              }
            }
            this.match.call(this, this.child, regexp);
          break;
          case Node.TEXT_NODE:
            this.retreiveLength = 0;
            this.child.data.replace(regexp, this.split.bind(this));
          break;
        }
      } while (this.child && (this.child = this.child.nextSibling));
      return node;
    },
    transform: function(node, match) {
      var span = document.createElement('span');
      span.className = this.className;
      span.textContent = match;
      node.parentNode.insertBefore(span, node);
    },
    on: function(element, terms) {
      var regexp = new RegExp(terms, 'ig');
      this.off(element);
      this.match(element, regexp);
      return element;
    },
    clean: function(onElement) {
      if (this.isInline(onElement.firstChild)) {
        onElement.parentNode.insertBefore(onElement.firstChild, onElement);
      }
      var text = document.createTextNode(onElement.textContent);
      onElement.parentNode.replaceChild(text, onElement);
      text.parentNode.normalize();
    },
    off: function(element) {
      if (!element) {
        return;
      }
      var hls = element.querySelectorAll('.' + this.className);
      if (hls.length === 0) {
        return;
      }
      for(var i = 0; i < hls.length; i++) { this.clean(hls[i]); }
    },
  };

  window.SearchHighlight = SearchHighlight;

})();
