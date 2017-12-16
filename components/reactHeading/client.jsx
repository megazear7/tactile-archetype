import React from 'react';
import reactInit from '../reactInit';

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

reactInit(".react-heading", Heading);
