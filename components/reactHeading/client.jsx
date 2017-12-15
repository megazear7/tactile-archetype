import ReactDOM from 'react-dom';
import React from 'react';
import $ from 'jquery';

class Heading extends React.Component {
	render() {
		var HeadingTag = `${this.props.size}`;

		return (
			<div>
				<HeadingTag>
	        {this.props.heading}
				</HeadingTag>
    		<p>{this.props.subtext}</p>
				{this.props.hashr &&
					<hr />
				}
			</div>
		);
	}
}

$(document).ready(function() {
	$(".react-heading").each(function() {
		var data = $(this).data();
		ReactDOM.render(
	    <Heading heading={data.heading}
							 subtext={data.subtext}
							 size={data.size}
							 hashr={data.hashr} />,
	    this
	  );
	});
});
