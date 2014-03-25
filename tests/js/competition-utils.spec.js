
var utils = require('../../js/competition-utils.js');

describe("The league sorter", function() {
	it("should be defined", function() {
		expect(utils.league_sorter).toBeDefined();
	});
	it("should sort inputs by points when already in order", function() {
		var raw = { 'ABC': 12.0, 'DEF': 3.5 };
		var expected = [
			{ 'tla': 'ABC', 'pos': 1, 'points': 12 },
			{ 'tla': 'DEF', 'pos': 2, 'points': 3.5 },
		];
		var league = utils.league_sorter(raw);
		expect(league).toEqual(expected);
	});
	it("should sort inputs by points when not already in order", function() {
		var raw = { 'ABC': 2.0, 'DEF': 3.5 };
		var expected = [
			{ 'tla': 'DEF', 'pos': 1, 'points': 3.5 },
			{ 'tla': 'ABC', 'pos': 2, 'points': 2 },
		];
		var league = utils.league_sorter(raw);
		expect(league).toEqual(expected);
	});
	it("should handle ties", function() {
		var raw = { 'ABC': 12.0, 'DEF': 5.0, 'GHI': 5.0, 'KLM': 2.0 };
		var game = { 'DEF': 25, 'GHI': 3 };
		var expected = [
			{ 'tla': 'ABC', 'pos': 1, 'points': 12 },
			{ 'tla': 'DEF', 'pos': 2, 'points': 5 },
			{ 'tla': 'GHI', 'pos': '', 'points': 5 },
			{ 'tla': 'KLM', 'pos': 4, 'points': 2 },
		];
		var league = utils.league_sorter(raw, null, game);
		expect(league).toEqual(expected);
	});
	it("should be re-usable", function() {
		var raw_1 = { 'ABC': 12.0, 'DEF': 3.5 };
		var expected_1 = [
			{ 'tla': 'ABC', 'pos': 1, 'points': 12 },
			{ 'tla': 'DEF', 'pos': 2, 'points': 3.5 },
		];
		var raw_2 = { 'ABC': 2.0, 'DEF': 2.0 };
		var game_2 = { 'ABC': 25, 'DEF': 5 };
		var expected_2 = [
			{ 'tla': 'ABC', 'pos': 1, 'points': 2 },
			{ 'tla': 'DEF', 'pos': '', 'points': 2 },
		];
		var league_1 = utils.league_sorter(raw_1);
		expect(league_1).toEqual(expected_1);
		var league_2 = utils.league_sorter(raw_2, null, game_2);
		expect(league_2).toEqual(expected_2);
		// repeat 1, with no ties
		var league_3 = utils.league_sorter(raw_1);
		expect(league_3).toEqual(expected_1);
	});
	it("should include a cutoff row if there are enough teams", function() {
		var raw = { 'ABC': 12.0, 'DEF': 5.0 };
		var expected = [
			{ 'tla': 'ABC', 'pos': 1, 'points': 12 },
			{ 'tla': '-', 'pos': '-', 'points': '-' },
			{ 'tla': 'DEF', 'pos': 2, 'points': 5 },
		];
		var league = utils.league_sorter(raw, 1);
		expect(league).toEqual(expected);
	});
	it("should not include a cutoff row if there are few enough teams", function() {
		var raw = { 'ABC': 12.0, 'DEF': 5.0 };
		var expected = [
			{ 'tla': 'ABC', 'pos': 1, 'points': 12 },
			{ 'tla': 'DEF', 'pos': 2, 'points': 5 },
		];
		var league = utils.league_sorter(raw, 2);
		expect(league).toEqual(expected);
	});
	it("should handle ties at the cutoff position", function() {
		var league = { 'ABC': 12.0, 'DEF': 5.0, 'GHI': 5.0, 'KLM': 2.0 };
		var game = { 'DEF': 3, 'GHI': 25 };
		var expected = [
			{ 'tla': 'ABC', 'pos': 1, 'points': 12 },
			{ 'tla': 'GHI', 'pos': 2, 'points': 5 },
			{ 'tla': '-', 'pos': '-', 'points': '-' },
			{ 'tla': 'DEF', 'pos': '', 'points': 5 },
			{ 'tla': 'KLM', 'pos': 4, 'points': 2 },
		];
		var league = utils.league_sorter(league, 2, game);
		expect(league).toEqual(expected);
	});
});

describe("The game points sorter", function() {
	it("should be defined", function() {
		expect(utils.gamepoints_sorter).toBeDefined();
	});
	it("should sort inputs by tla", function() {
		var raw = { 'ABC': 12, 'DEF': 3 };
		var expected = [
			{ 'tla': 'ABC', 'points': 12 },
			{ 'tla': 'DEF', 'points': 3 },
		];
		var league = utils.gamepoints_sorter(raw);
		expect(league).toEqual(expected);
	});
	it("should sort inputs by tla when not already in order", function() {
		var raw = { 'DEF': 3, 'ABC': 12 };
		var expected = [
			{ 'tla': 'ABC', 'points': 12 },
			{ 'tla': 'DEF', 'points': 3 },
		];
		var game = utils.gamepoints_sorter(raw);
		expect(game).toEqual(expected);
	});
	it("should sort inputs by tla when regardless of points", function() {
		var raw = { 'DEF': 12, 'ABC': 3 };
		var expected = [
			{ 'tla': 'ABC', 'points': 3 },
			{ 'tla': 'DEF', 'points': 12 },
		];
		var game = utils.gamepoints_sorter(raw);
		expect(game).toEqual(expected);
	});
});

describe("The match schedule converter sorter helpers", function() {
	it("should be defined", function() {
		expect(utils.match_converter).toBeDefined();
		expect(utils.convert_matches).toBeDefined();
	});
	var input, expected;
	beforeEach(function() {
		input = {
			'A': {
				'arena': 'A',
				'end_time': 'Sat, 15 Mar 2014 00:05:00 GMT',
				'num': 0,
				'start_time': 'Sat, 15 Mar 2014 00:00:00 GMT',
				'teams': [ 'CLY', 'TTN', 'SCC', 'DSF' ]
			},
			'B': {
				'arena': 'B',
				'end_time': 'Sat, 15 Mar 2014 00:05:00 GMT',
				'num': 0,
				'start_time': 'Sat, 15 Mar 2014 00:00:00 GMT',
				'teams': [ 'GRS', 'QMC', 'GRD', 'BRK' ]
			}
		};
		expected = {
			'number': 0,
			'time': '00:00:00',
			'teams': [ 'CLY', 'TTN', 'SCC', 'DSF', 'GRS', 'QMC', 'GRD', 'BRK' ]
		};
	});
	it("should flatten and simplify match descriptions", function() {
		var match = utils.match_converter(input);
		expect(match).toEqual(expected);
	});
	it("should flatten and simplify the collection of matches", function() {
		var matches = utils.convert_matches([input]);
		expect(matches).toEqual([expected]);
	});
	it("should have correct teams alignment even when there are not the maximum number", function() {
		input.A.teams = input.A.teams.slice(0, 2);
		input.B.teams = input.B.teams.slice(0, 3);
		expected.teams = input.A.teams.concat(['-', '-'], input.B.teams, ['-']);
		var matches = utils.convert_matches([input]);
		expect(matches).toEqual([expected]);
	});
});

describe("The match team filterer", function() {
	it("should be defined", function() {
		expect(utils.matches_for_team).toBeDefined();
	});
	var match_0 = {
		'number': 0,
		'time': '00:00:00',
		'teams': [ 'MAI', 'TTN', 'SCC', 'DSF', 'GRS', 'QMC', 'GRD', 'BRK' ]
	};
	var match_1 = {
		'number': 1,
		'time': '00:05:00',
		'teams': [ 'MAI2', 'QMS', 'LSS', 'EMM', 'GRS', 'BDF', 'NHS', 'MEA' ]
	};
	var input = [match_0, match_1];
	it("should return all when null team is given", function() {
		var matches = utils.matches_for_team(input, null);
		expect(matches).toBe(input);
	});
	it("should return all when no team is given", function() {
		var matches = utils.matches_for_team(input);
		expect(matches).toBe(input);
	});
	it("should return all when empty team is given", function() {
		var matches = utils.matches_for_team(input, '');
		expect(matches).toBe(input);
	});
	it("should return all matches containing the given team", function() {
		var matches = utils.matches_for_team(input, 'GRS');
		expect(matches).toEqual(input);
	});
	it("should return only matches containing the given team", function() {
		var matches = utils.matches_for_team(input, 'EMM');
		expect(matches).toEqual([match_1]);
	});
	it("should return only matches containing the exact team", function() {
		var matches = utils.matches_for_team(input, 'MAI');
		expect(matches).toEqual([match_0]);
	});
	it("should return nothing when no results", function() {
		var matches = utils.matches_for_team(input, 'ABC');
		expect(matches).toEqual([]);
	});
});
