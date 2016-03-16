"use strict";

function getData(callback) {
	var name = "richardhope",
			url = "https://teamtreehouse.com/" + name + ".json";

	$.getJSON(url).done(callback)
	.fail(function(error) {
			UI.renderError(error);
			UI.removeSpinner();
		});
}

$(function() {

  	UI.displaySpinner();

  	getData(function(res) {
			var data = res.badges,
					badgeList = new BadgeList(),

					badges = badgeList.getBadges(data),
					courses = badgeList.getCourses();
			
			UI.displayUI(courses, badgeList.list);
			UI.removeSpinner();
		});
});



function getBadges(json) {
	var badges = [];
	$.each(json, function(i, b) {
		var badge = new Badge(b);
		badges.push(badge);
	});
	return badges;
}

/////////////////////////////////////
//Badge Object
/////////////////////////////////////	

function Badge(badge) {
	this.id = badge.id;
	this.name = badge.name;
	this.iconUrl = badge.icon_url;
	if(badge.courses[0]) {
		this.course = badge.courses[0].title;
	} else {
		this.course = "Uncategorised";
	}
	this.url = badge.url;
	this.earnedDate = this.completedDate(badge.earned_date);
}

Badge.prototype.completedDate = function(date) {
	var d = new Date(date);
	return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

/////////////////////////////////////
//BadgeList Object
/////////////////////////////////////	

function BadgeList() {
	this.list = [];
}

BadgeList.prototype.getCourses = function() {
	var courses = [];

	$.each(this.list, function(i, badge) {
			var courseName = badge.course;
			if($.inArray(courseName, courses) === -1) {
				courses.push(courseName);
			}
	});
	return courses;
}

BadgeList.prototype.getBadges = function(json) {
	var self = this;
	$.each(json, function(i, b) {
		var badge = new Badge(b);
		self.list.push(badge);
	});
}

/////////////////////////////////////
//UI Object
/////////////////////////////////////	

var UI = {

	displayUI: function(courses, badges) {
		this.displayCourses(courses);
		this.displayBadges(badges);
	},

	displayBadges: function(badges) {
		var self = this;
		$.each(badges, function(i, badge) {

			var html = self.badgeHtml(badge);
			var courseName = badge.course.replace(/[^a-zA-Z]/g, '');
			var containerId = '#' + courseName;
			self.displayBadge(containerId, html);
		});
		this.addBadgesClickHandler(badges);
	},

	displayBadge: function(id, html) {
		$(id).append(html);
	},

	badgeHtml: function(badge) {
		var badgeHtml = "";
				badgeHtml += "<div id='" + badge.id + "' class='badges'>";
				badgeHtml += "<img src='" + badge.iconUrl + "' class='img-responsive'>";
				badgeHtml += "</div>";
		return badgeHtml;
	},

	addCourseClickHandler: function() {
		$(".panel-open").click(function() {
			$(this).children().children(".fa-chevron-right").toggleClass("rotate");
			$(this).siblings(".panel-body").children(".badge-details").remove();
			$(this).siblings(".panel-body").children(".badge-list").show();
			$(this).siblings(".panel-body").toggle(600);		
		});
	},

	detailsHtml: function(badges, id) {
		var badge = badges.filter(function( obj ) { 
			return obj.id == id; 
		})[0],
				details = '<div class="badge-details">';
		
		details += '<span class="fa fa-times fa-2x pull-right cross"></span>';
		details += '<a href="' + badge.url + '" target="_blank"><img src="' + badge.iconUrl + '"></a>';
	  details += '<a href="' + badge.url + '" target="_blank"><p>' + badge.name + '</p></a>';
		details += '<p>Completed on: ' + badge.earnedDate + '</p>';
		details += "</div>";

		return details;
	},

	addBadgesClickHandler: function(badges) {
		$('.badges').click(function() {
			var badgeID = $(this).attr('id'),
		  		badgeDetails = UI.detailsHtml(badges, badgeID);

			$(this).parents('.panel-body').children(".badge-details").remove();
			$(this).parents('.panel-body').children(".badge-list").hide();
			$(this).parents('.panel-body').append(badgeDetails);

			$(".badge-details .cross").click(function() {
				$(this).parent().siblings('.badge-list').show();
				$(this).parent().remove();
			});

		});
	},

	displayCourses: function(courses) {
		var html = this.coursesHtml(courses);
		$('#reportCard').append(html);
		this.addCourseClickHandler();
	},

	coursesHtml: function(courses) {

		var coursesHTML = "<div class='row'>",
				coursesCount = courses.length,
				courseColLength = Math.ceil(coursesCount / 3),
				count = 1;

		$.each(courses, function(i, course) {
			var courseName = course.replace(/[^a-zA-Z]/g, '');

			if(count === 1) {
				coursesHTML += "<div class='col-sm-4'>";
			}
			coursesHTML += "<div class='panel panel-default'>";
			coursesHTML += "<div class='panel-heading panel-open'>";
			coursesHTML += "<h6>" + course + " <span class='fa fa-chevron-right pull-right'></h6>";
			coursesHTML += "</div>";
			coursesHTML += "<div class='panel-body'>";
			coursesHTML += "<div id='" + courseName + "'class='badge-list clearfix'></div>";
			coursesHTML += "</div>";
			coursesHTML += "</div>";
			if(count === coursesCount) {
				coursesHTML += "</div>";
			}
			if(count % courseColLength == 0) {
				coursesHTML += "</div><div class='col-sm-4'>";
			}

			count ++
		});
		return coursesHTML;

	},

	displaySpinner: function() {
		var spinner = "<div class='overlay'>";
				spinner += "<div class='overlay-content'>";
				spinner += "<i class='fa fa-spinner fa-3x spinning'></i>";
				spinner += "</div>";
				spinner += "</div>";

		$(".wrapper").append(spinner);
	},

	removeSpinner: function() {
		$(".overlay").remove();
	},

	renderError: function(error) {
		var errorHtml = "<div class='overlay'>";
				errorHtml += "<div class='overlay-content'>";
				errorHtml += "<p>Something went wrong. Try again.</p>";
				errorHtml += "<p>" + error + "</p>"
				errorHtml += "</div></div>";
		$("wrapper").append(errorHtml);
	}

};

