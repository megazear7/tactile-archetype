import React from 'react';
import ReactDOM from 'react-dom';

export default function reactInit(selector, ReactComponent) {
  document.addEventListener('DOMContentLoaded', function() {
  	document.querySelectorAll(selector).forEach(function(node) {
  		ReactDOM.render(
        <ReactComponent heading={node.getAttribute('data-heading')}
              					subtext={node.getAttribute('data-subtext')}
              					size={node.getAttribute('data-size')}
              					hashr={node.getAttribute('data-hashr')} />,
        node);
  	});
  });
}
