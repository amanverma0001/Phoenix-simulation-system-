import { realtimeDb } from './RealtimeDatabaseService';

export const geopoliticalData = {
    "geopolitical_data": {
        "countries": {
            "russia": {
                "name": "Russia",
                "code": "RUS",
                "region": "europe",
                "population": 144,
                "gdp": 1862,
                "metrics": {
                    "energySecurity": 0.98,
                    "economicHealth": 0.62,
                    "politicalStability": 0.68,
                    "militaryPower": 0.92,
                    "diplomaticInfluence": 0.78,
                    "globalInfluence": 0.80
                },
                "exports": {
                    "gas": {
                        "germany": { "volume": 155, "dependency": 0.55, "critical": true },
                        "poland": { "volume": 9, "dependency": 0.48, "critical": true },
                        "austria": { "volume": 7, "dependency": 0.80, "critical": true },
                        "hungary": { "volume": 10, "dependency": 0.85, "critical": true },
                        "czech": { "volume": 8, "dependency": 0.66, "critical": true },
                        "italy": { "volume": 22, "dependency": 0.43, "critical": false },
                        "turkey": { "volume": 24, "dependency": 0.45, "critical": false },
                        "france": { "volume": 8, "dependency": 0.17, "critical": false },
                        "netherlands": { "volume": 4, "dependency": 0.12, "critical": false },
                        "belgium": { "volume": 3, "dependency": 0.35, "critical": false }
                    },
                    "oil": {
                        "germany": { "volume": 24, "dependency": 0.34, "critical": false },
                        "poland": { "volume": 27, "dependency": 0.63, "critical": true },
                        "italy": { "volume": 15, "dependency": 0.13, "critical": false },
                        "france": { "volume": 8, "dependency": 0.10, "critical": false },
                        "netherlands": { "volume": 19, "dependency": 0.25, "critical": false },
                        "spain": { "volume": 5, "dependency": 0.05, "critical": false },
                        "turkey": { "volume": 12, "dependency": 0.18, "critical": false }
                    },
                    "coal": {
                        "germany": { "volume": 20, "dependency": 0.50, "critical": false },
                        "poland": { "volume": 12, "dependency": 0.75, "critical": true },
                        "austria": { "volume": 3, "dependency": 0.78, "critical": true },
                        "italy": { "volume": 6, "dependency": 0.56, "critical": false },
                        "turkey": { "volume": 8, "dependency": 0.52, "critical": false },
                        "france": { "volume": 4, "dependency": 0.15, "critical": false }
                    }
                },
                "imports": {
                    "trade": {
                        "china": { "volume": 110, "dependency": 0.35 },
                        "germany": { "volume": 45, "dependency": 0.15 },
                        "turkey": { "volume": 20, "dependency": 0.08 },
                        "belarus": { "volume": 15, "dependency": 0.05 }
                    }
                },
                "allies": ["belarus", "armenia", "kazakhstan", "syria"],
                "rivals": ["usa", "uk", "poland", "ukraine"],
                "vulnerabilities": [
                    "Western sanctions",
                    "Oil price dependency",
                    "Brain drain",
                    "Technological isolation",
                    "Demographic decline"
                ],
                "strategicAssets": [
                    "World's largest gas reserves",
                    "Nuclear arsenal",
                    "Arctic resources",
                    "Space program",
                    "UN Security Council veto"
                ],
                "coordinates": { "lat": 61.5240, "lon": 105.3188 }
            },
            "germany": {
                "name": "Germany",
                "code": "DEU",
                "region": "europe",
                "population": 83,
                "gdp": 4223,
                "metrics": {
                    "energySecurity": 0.35,
                    "economicHealth": 0.88,
                    "politicalStability": 0.92,
                    "militaryPower": 0.65,
                    "diplomaticInfluence": 0.87,
                    "globalInfluence": 0.85
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 155, "dependency": 0.55, "critical": true },
                        "norway": { "volume": 50, "dependency": 0.30, "critical": false },
                        "netherlands": { "volume": 25, "dependency": 0.15, "critical": false }
                    },
                    "oil": {
                        "russia": { "volume": 24, "dependency": 0.34, "critical": false },
                        "norway": { "volume": 8, "dependency": 0.11, "critical": false },
                        "uk": { "volume": 6, "dependency": 0.08, "critical": false },
                        "kazakhstan": { "volume": 15, "dependency": 0.12, "critical": false }
                    },
                    "coal": {
                        "russia": { "volume": 20, "dependency": 0.50, "critical": false },
                        "colombia": { "volume": 8, "dependency": 0.20, "critical": false },
                        "usa": { "volume": 6, "dependency": 0.15, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "france": { "volume": 180, "dependency": 0.45 },
                        "usa": { "volume": 150, "dependency": 0.35 },
                        "china": { "volume": 120, "dependency": 0.30 },
                        "poland": { "volume": 120, "dependency": 0.65 },
                        "czech": { "volume": 90, "dependency": 0.70 },
                        "austria": { "volume": 75, "dependency": 0.55 },
                        "italy": { "volume": 95, "dependency": 0.40 }
                    },
                    "gas": {
                        "poland": { "volume": 12, "dependency": 0.25, "critical": false },
                        "czech": { "volume": 5, "dependency": 0.14, "critical": false }
                    }
                },
                "allies": ["france", "usa", "uk", "poland", "nato"],
                "rivals": ["russia"],
                "vulnerabilities": [
                    "Russian gas dependency",
                    "Energy import reliance",
                    "Aging population",
                    "Manufacturing export sensitivity",
                    "Coalition government fragility"
                ],
                "strategicAssets": [
                    "EU's largest economy",
                    "Advanced manufacturing",
                    "Chemical industry hub",
                    "Financial center (Frankfurt)",
                    "EU political leadership"
                ],
                "coordinates": { "lat": 51.1657, "lon": 10.4515 }
            },
            "poland": {
                "name": "Poland",
                "code": "POL",
                "region": "europe",
                "population": 38,
                "gdp": 688,
                "metrics": {
                    "energySecurity": 0.52,
                    "economicHealth": 0.78,
                    "politicalStability": 0.75,
                    "militaryPower": 0.58,
                    "diplomaticInfluence": 0.55,
                    "globalInfluence": 0.58
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 9, "dependency": 0.48, "critical": true },
                        "germany": { "volume": 12, "dependency": 0.25, "critical": false },
                        "norway": { "volume": 8, "dependency": 0.15, "critical": false },
                        "qatar": { "volume": 3, "dependency": 0.06, "critical": false }
                    },
                    "oil": {
                        "russia": { "volume": 27, "dependency": 0.63, "critical": true },
                        "saudi_arabia": { "volume": 6, "dependency": 0.15, "critical": false },
                        "norway": { "volume": 4, "dependency": 0.10, "critical": false }
                    },
                    "coal": {
                        "russia": { "volume": 12, "dependency": 0.75, "critical": true },
                        "colombia": { "volume": 2, "dependency": 0.15, "critical": false }
                    },
                    "trade": {
                        "germany": { "volume": 120, "dependency": 0.65, "critical": false },
                        "czech": { "volume": 30, "dependency": 0.20, "critical": false },
                        "france": { "volume": 25, "dependency": 0.15, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 80, "dependency": 0.40 },
                        "czech": { "volume": 25, "dependency": 0.45 },
                        "uk": { "volume": 20, "dependency": 0.10 }
                    },
                    "coal": {
                        "czech": { "volume": 4, "dependency": 0.42, "critical": false },
                        "austria": { "volume": 1, "dependency": 0.12, "critical": false }
                    }
                },
                "transitRoutes": {
                    "gas": {
                        "russia_to_germany": { "volume": 45, "fees": 2, "critical": true },
                        "russia_to_czech": { "volume": 8, "fees": 0.5, "critical": false }
                    }
                },
                "allies": ["usa", "uk", "germany", "lithuania", "nato"],
                "rivals": ["russia", "belarus"],
                "vulnerabilities": [
                    "Russian energy dependency",
                    "Transit route vulnerability",
                    "Coal dependency",
                    "Geographic exposure to Russia",
                    "Rule of law concerns"
                ],
                "strategicAssets": [
                    "NATO eastern flank",
                    "Transit corridor (gas, trade)",
                    "Growing economy",
                    "EU cohesion funds",
                    "Large military for region"
                ],
                "coordinates": { "lat": 51.9194, "lon": 19.1451 }
            },
            "turkey": {
                "name": "Turkey",
                "code": "TUR",
                "region": "europe",
                "population": 84,
                "gdp": 906,
                "metrics": {
                    "energySecurity": 0.28,
                    "economicHealth": 0.58,
                    "politicalStability": 0.62,
                    "militaryPower": 0.82,
                    "diplomaticInfluence": 0.72,
                    "globalInfluence": 0.68
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 24, "dependency": 0.45, "critical": false },
                        "azerbaijan": { "volume": 6, "dependency": 0.17, "critical": false },
                        "iran": { "volume": 5, "dependency": 0.16, "critical": false },
                        "algeria": { "volume": 4, "dependency": 0.12, "critical": false }
                    },
                    "oil": {
                        "iraq": { "volume": 18, "dependency": 0.26, "critical": false },
                        "russia": { "volume": 12, "dependency": 0.18, "critical": false },
                        "iran": { "volume": 8, "dependency": 0.12, "critical": false },
                        "saudi_arabia": { "volume": 7, "dependency": 0.11, "critical": false }
                    },
                    "coal": {
                        "russia": { "volume": 8, "dependency": 0.52, "critical": false },
                        "colombia": { "volume": 3, "dependency": 0.20, "critical": false },
                        "usa": { "volume": 2, "dependency": 0.15, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 35, "dependency": 0.25 },
                        "iraq": { "volume": 20, "dependency": 0.45 },
                        "uk": { "volume": 18, "dependency": 0.10 },
                        "italy": { "volume": 15, "dependency": 0.08 }
                    }
                },
                "strategicControl": {
                    "bosphorus": {
                        "oilThroughput": "3% of global oil",
                        "controlledCountries": ["russia", "kazakhstan", "azerbaijan"],
                        "leverage": 0.85,
                        "critical": true
                    },
                    "turkStream": {
                        "gasThroughput": 15.75,
                        "toCountries": ["bulgaria", "serbia", "hungary"],
                        "critical": false
                    }
                },
                "allies": ["azerbaijan", "pakistan", "qatar", "nato"],
                "rivals": ["greece", "armenia", "syria", "kurdish_groups"],
                "vulnerabilities": [
                    "High energy imports",
                    "Economic instability",
                    "Currency volatility",
                    "Kurdish conflict",
                    "Refugee burden (4M+)"
                ],
                "strategicAssets": [
                    "Bosphorus Strait control",
                    "NATO's 2nd largest army",
                    "Regional military power",
                    "Transit hub (Europe-Asia-Middle East)",
                    "Drone technology"
                ],
                "coordinates": { "lat": 38.9637, "lon": 35.2433 }
            },
            "ukraine": {
                "name": "Ukraine",
                "code": "UKR",
                "region": "europe",
                "population": 43,
                "gdp": 161,
                "metrics": {
                    "energySecurity": 0.42,
                    "economicHealth": 0.28,
                    "politicalStability": 0.35,
                    "militaryPower": 0.68,
                    "diplomaticInfluence": 0.48,
                    "globalInfluence": 0.45
                },
                "imports": {
                    "gas": {
                        "slovakia": { "volume": 6, "dependency": 0.40, "critical": false },
                        "poland": { "volume": 4, "dependency": 0.30, "critical": false },
                        "hungary": { "volume": 2, "dependency": 0.20, "critical": false }
                    },
                    "oil": {
                        "azerbaijan": { "volume": 4, "dependency": 0.35, "critical": false },
                        "kazakhstan": { "volume": 3, "dependency": 0.25, "critical": false },
                        "belarus": { "volume": 2, "dependency": 0.20, "critical": false }
                    },
                    "coal": {
                        "kazakhstan": { "volume": 5, "dependency": 0.50, "critical": false },
                        "poland": { "volume": 2, "dependency": 0.25, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "poland": { "volume": 8, "dependency": 0.20 },
                        "turkey": { "volume": 6, "dependency": 0.15 },
                        "romania": { "volume": 4, "dependency": 0.12 }
                    },
                    "agriculture": {
                        "world": { "wheat": 20, "corn": 30, "sunflower": 50 }
                    }
                },
                "transitRoutes": {
                    "gas": {
                        "russia_to_europe": { "volume": 0, "fees": 0, "status": "cut_off_2022" }
                    }
                },
                "allies": ["poland", "uk", "usa", "lithuania", "eu_support"],
                "rivals": ["russia", "belarus"],
                "vulnerabilities": [
                    "Active war with Russia",
                    "Infrastructure damage (40%+)",
                    "Economic collapse",
                    "7M refugees fled",
                    "Ongoing military operations"
                ],
                "strategicAssets": [
                    "Agricultural powerhouse (wheat, corn)",
                    "Mineral resources",
                    "IT sector",
                    "Strategic location",
                    "Western military support"
                ],
                "coordinates": { "lat": 48.3794, "lon": 31.1656 }
            },
            "france": {
                "name": "France",
                "code": "FRA",
                "region": "europe",
                "population": 67,
                "gdp": 2937,
                "metrics": {
                    "energySecurity": 0.82,
                    "economicHealth": 0.82,
                    "politicalStability": 0.78,
                    "militaryPower": 0.88,
                    "diplomaticInfluence": 0.92,
                    "globalInfluence": 0.88
                },
                "imports": {
                    "gas": {
                        "norway": { "volume": 18, "dependency": 0.36, "critical": false },
                        "russia": { "volume": 8, "dependency": 0.17, "critical": false },
                        "algeria": { "volume": 7, "dependency": 0.14, "critical": false },
                        "netherlands": { "volume": 5, "dependency": 0.11, "critical": false }
                    },
                    "oil": {
                        "saudi_arabia": { "volume": 8, "dependency": 0.12, "critical": false },
                        "kazakhstan": { "volume": 7, "dependency": 0.11, "critical": false },
                        "russia": { "volume": 6, "dependency": 0.10, "critical": false },
                        "nigeria": { "volume": 6, "dependency": 0.09, "critical": false }
                    },
                    "coal": {
                        "usa": { "volume": 4, "dependency": 0.29, "critical": false },
                        "australia": { "volume": 4, "dependency": 0.28, "critical": false },
                        "russia": { "volume": 2, "dependency": 0.15, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 180, "dependency": 0.45 },
                        "italy": { "volume": 85, "dependency": 0.30 },
                        "spain": { "volume": 70, "dependency": 0.25 },
                        "belgium": { "volume": 60, "dependency": 0.40 },
                        "uk": { "volume": 55, "dependency": 0.15 }
                    },
                    "nuclear_technology": {
                        "world": { "reactors": 56, "expertise": 0.95 }
                    }
                },
                "allies": ["germany", "uk", "usa", "nato", "eu"],
                "rivals": ["russia"],
                "vulnerabilities": [
                    "Pension crisis",
                    "Nuclear reactor maintenance",
                    "Social unrest (protests)",
                    "Public debt",
                    "Political fragmentation"
                ],
                "strategicAssets": [
                    "70% nuclear energy (energy independent)",
                    "UN Security Council permanent seat",
                    "Nuclear weapons (290 warheads)",
                    "Large professional military",
                    "African influence (former colonies)",
                    "Space program"
                ],
                "coordinates": { "lat": 46.2276, "lon": 2.2137 }
            },
            "italy": {
                "name": "Italy",
                "code": "ITA",
                "region": "europe",
                "population": 60,
                "gdp": 2107,
                "metrics": {
                    "energySecurity": 0.38,
                    "economicHealth": 0.72,
                    "politicalStability": 0.68,
                    "militaryPower": 0.68,
                    "diplomaticInfluence": 0.75,
                    "globalInfluence": 0.72
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 22, "dependency": 0.43, "critical": false },
                        "algeria": { "volume": 14, "dependency": 0.28, "critical": false },
                        "azerbaijan": { "volume": 8, "dependency": 0.10, "critical": false },
                        "libya": { "volume": 4, "dependency": 0.08, "critical": false },
                        "qatar": { "volume": 7, "dependency": 0.12, "critical": false }
                    },
                    "oil": {
                        "azerbaijan": { "volume": 10, "dependency": 0.14, "critical": false },
                        "russia": { "volume": 9, "dependency": 0.13, "critical": false },
                        "iraq": { "volume": 8, "dependency": 0.12, "critical": false },
                        "saudi_arabia": { "volume": 7, "dependency": 0.11, "critical": false }
                    },
                    "coal": {
                        "russia": { "volume": 6, "dependency": 0.56, "critical": false },
                        "usa": { "volume": 2, "dependency": 0.22, "critical": false },
                        "colombia": { "volume": 1, "dependency": 0.12, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 95, "dependency": 0.40 },
                        "france": { "volume": 85, "dependency": 0.30 },
                        "usa": { "volume": 60, "dependency": 0.20 },
                        "spain": { "volume": 45, "dependency": 0.18 },
                        "uk": { "volume": 40, "dependency": 0.12 }
                    }
                },
                "allies": ["germany", "france", "usa", "nato", "eu"],
                "rivals": [],
                "vulnerabilities": [
                    "High public debt (135% GDP)",
                    "Political instability (frequent gov changes)",
                    "Energy dependency",
                    "Aging population",
                    "North-South divide"
                ],
                "strategicAssets": [
                    "G7 member",
                    "Mediterranean strategic position",
                    "Manufacturing hub (luxury, automotive)",
                    "Tourism (5th most visited)",
                    "TAP pipeline terminal"
                ],
                "coordinates": { "lat": 41.8719, "lon": 12.5674 }
            },
            "spain": {
                "name": "Spain",
                "code": "ESP",
                "region": "europe",
                "population": 47,
                "gdp": 1426,
                "metrics": {
                    "energySecurity": 0.55,
                    "economicHealth": 0.75,
                    "politicalStability": 0.72,
                    "militaryPower": 0.62,
                    "diplomaticInfluence": 0.68,
                    "globalInfluence": 0.68
                },
                "imports": {
                    "gas": {
                        "algeria": { "volume": 22, "dependency": 0.43, "critical": false },
                        "nigeria": { "volume": 7, "dependency": 0.13, "critical": false },
                        "qatar": { "volume": 6, "dependency": 0.12, "critical": false },
                        "usa": { "volume": 5, "dependency": 0.10, "critical": false }
                    },
                    "oil": {
                        "mexico": { "volume": 8, "dependency": 0.13, "critical": false },
                        "saudi_arabia": { "volume": 7, "dependency": 0.12, "critical": false },
                        "brazil": { "volume": 7, "dependency": 0.11, "critical": false },
                        "iraq": { "volume": 6, "dependency": 0.10, "critical": false }
                    },
                    "coal": {
                        "colombia": { "volume": 8, "dependency": 0.35, "critical": false },
                        "russia": { "volume": 6, "dependency": 0.28, "critical": false },
                        "usa": { "volume": 4, "dependency": 0.20, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "france": { "volume": 70, "dependency": 0.25 },
                        "germany": { "volume": 55, "dependency": 0.20 },
                        "italy": { "volume": 45, "dependency": 0.18 },
                        "portugal": { "volume": 30, "dependency": 0.50, "critical": false }
                    }
                },
                "allies": ["france", "portugal", "germany", "nato", "eu"],
                "rivals": [],
                "vulnerabilities": [
                    "Catalan independence movement",
                    "High unemployment (13%)",
                    "Tourism dependency",
                    "Regional separatism",
                    "Youth unemployment"
                ],
                "strategicAssets": [
                    "Atlantic-Mediterranean gateway",
                    "Latin America cultural ties",
                    "Renewable energy leader (wind, solar)",
                    "Strategic location (Gibraltar)",
                    "Tourism sector"
                ],
                "coordinates": { "lat": 40.4637, "lon": -3.7492 }
            },
            "austria": {
                "name": "Austria",
                "code": "AUT",
                "region": "europe",
                "population": 9,
                "gdp": 471,
                "metrics": {
                    "energySecurity": 0.22,
                    "economicHealth": 0.85,
                    "politicalStability": 0.88,
                    "militaryPower": 0.42,
                    "diplomaticInfluence": 0.58,
                    "globalInfluence": 0.58
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 7, "dependency": 0.80, "critical": true },
                        "norway": { "volume": 1, "dependency": 0.12, "critical": false },
                        "germany": { "volume": 0.7, "dependency": 0.08, "critical": false }
                    },
                    "oil": {
                        "kazakhstan": { "volume": 3, "dependency": 0.24, "critical": false },
                        "russia": { "volume": 2.5, "dependency": 0.21, "critical": false },
                        "iraq": { "volume": 2, "dependency": 0.16, "critical": false },
                        "libya": { "volume": 1.5, "dependency": 0.14, "critical": false }
                    },
                    "coal": {
                        "russia": { "volume": 3, "dependency": 0.78, "critical": true },
                        "poland": { "volume": 0.5, "dependency": 0.12, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 75, "dependency": 0.55 },
                        "italy": { "volume": 35, "dependency": 0.25 },
                        "switzerland": { "volume": 25, "dependency": 0.35 }
                    }
                },
                "allies": ["germany", "switzerland", "eu"],
                "rivals": [],
                "vulnerabilities": [
                    "EXTREME Russian gas dependency (80%)",
                    "Small military (neutral)",
                    "Landlocked",
                    "Tourism dependency",
                    "No NATO membership"
                ],
                "strategicAssets": [
                    "Banking sector",
                    "Alpine tourism",
                    "Central European hub",
                    "Political neutrality (mediator)",
                    "High living standards"
                ],
                "coordinates": { "lat": 47.5162, "lon": 14.5501 }
            },
            "czech": {
                "name": "Czech Republic",
                "code": "CZE",
                "region": "europe",
                "population": 10.5,
                "gdp": 281,
                "metrics": {
                    "energySecurity": 0.45,
                    "economicHealth": 0.78,
                    "politicalStability": 0.82,
                    "militaryPower": 0.48,
                    "diplomaticInfluence": 0.52,
                    "globalInfluence": 0.55
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 8, "dependency": 0.66, "critical": true },
                        "norway": { "volume": 2.5, "dependency": 0.20, "critical": false },
                        "germany": { "volume": 1.5, "dependency": 0.14, "critical": false }
                    },
                    "oil": {
                        "russia": { "volume": 6, "dependency": 0.58, "critical": false },
                        "azerbaijan": { "volume": 2, "dependency": 0.18, "critical": false },
                        "norway": { "volume": 1.5, "dependency": 0.12, "critical": false }
                    },
                    "coal": {
                        "poland": { "volume": 4, "dependency": 0.42, "critical": false },
                        "russia": { "volume": 3.5, "dependency": 0.38, "critical": false },
                        "germany": { "volume": 2, "dependency": 0.20, "critical": false }
                    },
                    "trade": {
                        "germany": { "volume": 90, "dependency": 0.70, "critical": false },
                        "poland": { "volume": 30, "dependency": 0.25, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 65, "dependency": 0.55 },
                        "slovakia": { "volume": 20, "dependency": 0.45 },
                        "poland": { "volume": 25, "dependency": 0.20 }
                    }
                },
                "allies": ["germany", "poland", "slovakia", "nato", "eu"],
                "rivals": ["russia"],
                "vulnerabilities": [
                    "Russian energy dependency (66% gas)",
                    "Small economy",
                    "Landlocked",
                    "Export-dependent",
                    "Brain drain to West"
                ],
                "strategicAssets": [
                    "Strategic Central European location",
                    "Manufacturing hub (automotive)",
                    "Stable democracy",
                    "EU membership",
                    "Skilled workforce"
                ],
                "coordinates": { "lat": 49.8175, "lon": 15.4730 }
            },
            "hungary": {
                "name": "Hungary",
                "code": "HUN",
                "region": "europe",
                "population": 9.7,
                "gdp": 181,
                "metrics": {
                    "energySecurity": 0.18,
                    "economicHealth": 0.68,
                    "politicalStability": 0.62,
                    "militaryPower": 0.45,
                    "diplomaticInfluence": 0.48,
                    "globalInfluence": 0.48
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 10, "dependency": 0.85, "critical": true },
                        "austria": { "volume": 1.2, "dependency": 0.10, "critical": false },
                        "romania": { "volume": 0.6, "dependency": 0.05, "critical": false }
                    },
                    "oil": {
                        "russia": { "volume": 6, "dependency": 0.62, "critical": true },
                        "iraq": { "volume": 2, "dependency": 0.18, "critical": false },
                        "croatia": { "volume": 1.2, "dependency": 0.12, "critical": false }
                    },
                    "coal": {
                        "russia": { "volume": 2.5, "dependency": 0.72, "critical": true },
                        "poland": { "volume": 0.6, "dependency": 0.18, "critical": false }
                    },
                    "trade": {
                        "germany": { "volume": 45, "dependency": 0.50, "critical": false },
                        "austria": { "volume": 20, "dependency": 0.25, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 30, "dependency": 0.35 },
                        "romania": { "volume": 12, "dependency": 0.22 },
                        "slovakia": { "volume": 10, "dependency": 0.25 }
                    }
                },
                "allies": ["russia", "serbia", "china"],
                "rivals": ["ukraine"],
                "vulnerabilities": [
                    "EXTREME Russian dependency (85% gas)",
                    "Authoritarian drift (Orban)",
                    "EU tensions",
                    "Currency weakness",
                    "Brain drain"
                ],
                "strategicAssets": [
                    "Strategic location",
                    "Manufacturing (automotive)",
                    "Russian gas leverage",
                    "Visegrad Group member",
                    "EU funding recipient"
                ],
                "coordinates": { "lat": 47.1625, "lon": 19.5033 }
            },
            "qatar": {
                "name": "Qatar",
                "code": "QAT",
                "region": "middle_east",
                "population": 2.8,
                "gdp": 237,
                "metrics": {
                    "energySecurity": 0.99,
                    "economicHealth": 0.95,
                    "politicalStability": 0.85,
                    "militaryPower": 0.52,
                    "diplomaticInfluence": 0.68,
                    "globalInfluence": 0.68
                },
                "exports": {
                    "gas": {
                        "china": { "volume": 16, "dependency": 0.05 },
                        "india": { "volume": 14, "dependency": 0.08 },
                        "japan": { "volume": 12, "dependency": 0.12 },
                        "south_korea": { "volume": 10, "dependency": 0.10 },
                        "uk": { "volume": 8, "dependency": 0.08 },
                        "italy": { "volume": 7, "dependency": 0.12 },
                        "spain": { "volume": 6, "dependency": 0.12 },
                        "germany": { "volume": 8, "dependency": 0.08 },
                        "poland": { "volume": 3, "dependency": 0.06 },
                        "france": { "volume": 5, "dependency": 0.05 }
                    },
                    "oil": {
                        "china": { "volume": 10, "dependency": 0.02 },
                        "india": { "volume": 8, "dependency": 0.04 },
                        "japan": { "volume": 7, "dependency": 0.05 }
                    }
                },
                "allies": ["usa", "turkey", "kuwait", "oman"],
                "rivals": ["saudi_arabia", "uae", "egypt"],
                "vulnerabilities": [
                    "Small population (90% expats)",
                    "Regional tensions (Saudi blockade 2017-2021)",
                    "Blockade risk",
                    "Climate (extreme heat)",
                    "Single-resource economy"
                ],
                "strategicAssets": [
                    "World's largest LNG exporter",
                    "Massive wealth ($70k GDP per capita)",
                    "Al Jazeera (media influence)",
                    "Diplomatic mediator",
                    "US military base (Al Udeid)"
                ],
                "coordinates": { "lat": 25.3548, "lon": 51.1839 }
            },
            "kazakhstan": {
                "name": "Kazakhstan",
                "code": "KAZ",
                "region": "asia",
                "population": 19,
                "gdp": 220,
                "metrics": {
                    "energySecurity": 0.96,
                    "economicHealth": 0.72,
                    "politicalStability": 0.68,
                    "militaryPower": 0.55,
                    "diplomaticInfluence": 0.58,
                    "globalInfluence": 0.62
                },
                "exports": {
                    "oil": {
                        "germany": { "volume": 15, "dependency": 0.12 },
                        "italy": { "volume": 10, "dependency": 0.14 },
                        "france": { "volume": 7, "dependency": 0.11 },
                        "netherlands": { "volume": 8, "dependency": 0.18 },
                        "austria": { "volume": 3, "dependency": 0.24 },
                        "china": { "volume": 20, "dependency": 0.05 }
                    },
                    "gas": {
                        "china": { "volume": 12, "dependency": 0.03 },
                        "russia": { "volume": 5, "dependency": 0.01 }
                    },
                    "coal": {
                        "ukraine": { "volume": 5, "dependency": 0.50 },
                        "russia": { "volume": 3, "dependency": 0.02 }
                    },
                    "uranium": {
                        "world": { "volume": 0, "percentage": 40 }
                    }
                },
                "imports": {
                    "trade": {
                        "russia": { "volume": 25, "dependency": 0.40 },
                        "china": { "volume": 20, "dependency": 0.35 }
                    }
                },
                "transitRoutes": {
                    "oil": {
                        "cpc_pipeline": { "volume": 60, "destination": "europe_via_russia" }
                    }
                },
                "allies": ["russia", "china", "turkey"],
                "rivals": [],
                "vulnerabilities": [
                    "Russian influence",
                    "Chinese debt dependency",
                    "Political unrest (2022 protests)",
                    "Corruption",
                    "Landlocked"
                ],
                "strategicAssets": [
                    "Oil reserves (30 billion barrels)",
                    "Gas reserves",
                    "Alternative route to Russia (CPC pipeline)",
                    "Uranium (40% of global production)",
                    "Strategic location (China-Europe)"
                ],
                "coordinates": { "lat": 48.0196, "lon": 66.9237 }
            },
            "norway": {
                "name": "Norway",
                "code": "NOR",
                "region": "europe",
                "population": 5.4,
                "gdp": 482,
                "metrics": {
                    "energySecurity": 0.99,
                    "economicHealth": 0.95,
                    "politicalStability": 0.95,
                    "militaryPower": 0.58,
                    "diplomaticInfluence": 0.72,
                    "globalInfluence": 0.72
                },
                "exports": {
                    "gas": {
                        "germany": { "volume": 50, "dependency": 0.30 },
                        "uk": { "volume": 40, "dependency": 0.45 },
                        "france": { "volume": 18, "dependency": 0.36 },
                        "netherlands": { "volume": 12, "dependency": 0.25 },
                        "belgium": { "volume": 10, "dependency": 0.40 },
                        "poland": { "volume": 8, "dependency": 0.15 },
                        "czech": { "volume": 2.5, "dependency": 0.20 },
                        "austria": { "volume": 1, "dependency": 0.12 }
                    },
                    "oil": {
                        "uk": { "volume": 25, "dependency": 0.30 },
                        "germany": { "volume": 8, "dependency": 0.11 },
                        "netherlands": { "volume": 10, "dependency": 0.22 },
                        "france": { "volume": 8, "dependency": 0.12 },
                        "poland": { "volume": 4, "dependency": 0.10 }
                    }
                },
                "imports": {
                    "coal": {
                        "russia": { "volume": 1.5, "dependency": 0.30 },
                        "colombia": { "volume": 2, "dependency": 0.40 },
                        "usa": { "volume": 1.5, "dependency": 0.30 }
                    }
                },
                "allies": ["uk", "germany", "usa", "nato"],
                "rivals": ["russia"],
                "vulnerabilities": [
                    "Oil price dependency",
                    "Small population",
                    "Arctic tensions with Russia",
                    "Aging oil fields",
                    "Climate policy vs oil production"
                ],
                "strategicAssets": [
                    "Massive oil reserves",
                    "Massive gas reserves",
                    "Sovereign wealth fund ($1.4 trillion)",
                    "Arctic access and resources",
                    "Stable democracy",
                    "Alternative to Russian gas"
                ],
                "coordinates": { "lat": 60.4720, "lon": 8.4689 }
            },
            "azerbaijan": {
                "name": "Azerbaijan",
                "code": "AZE",
                "region": "asia",
                "population": 10,
                "gdp": 78,
                "metrics": {
                    "energySecurity": 0.95,
                    "economicHealth": 0.68,
                    "politicalStability": 0.62,
                    "militaryPower": 0.62,
                    "diplomaticInfluence": 0.55,
                    "globalInfluence": 0.58
                },
                "exports": {
                    "gas": {
                        "turkey": { "volume": 6, "dependency": 0.17 },
                        "italy": { "volume": 8, "dependency": 0.10 },
                        "greece": { "volume": 2, "dependency": 0.35 },
                        "bulgaria": { "volume": 1, "dependency": 0.25 }
                    },
                    "oil": {
                        "italy": { "volume": 10, "dependency": 0.14 },
                        "turkey": { "volume": 5, "dependency": 0.08 },
                        "czech": { "volume": 2, "dependency": 0.18 }
                    }
                },
                "imports": {
                    "trade": {
                        "turkey": { "volume": 5, "dependency": 0.35 },
                        "russia": { "volume": 3, "dependency": 0.20 }
                    },
                    "coal": {
                        "russia": { "volume": 0.5, "dependency": 0.55 },
                        "turkey": { "volume": 0.3, "dependency": 0.25 }
                    }
                },
                "allies": ["turkey", "israel", "pakistan"],
                "rivals": ["armenia", "iran"],
                "vulnerabilities": [
                    "Armenian conflict (Nagorno-Karabakh)",
                    "Authoritarian government",
                    "Corruption",
                    "Oil price dependency",
                    "Russian influence"
                ],
                "strategicAssets": [
                    "Oil reserves",
                    "Gas reserves",
                    "Caspian Sea access",
                    "Alternative gas route to Europe (TAP, TANAP)",
                    "Strategic location (Caucasus)",
                    "Turkish alliance"
                ],
                "coordinates": { "lat": 40.1431, "lon": 47.5769 }
            },
            "netherlands": {
                "name": "Netherlands",
                "code": "NLD",
                "region": "europe",
                "population": 17.4,
                "gdp": 1013,
                "metrics": {
                    "energySecurity": 0.48,
                    "economicHealth": 0.88,
                    "politicalStability": 0.90,
                    "militaryPower": 0.58,
                    "diplomaticInfluence": 0.75,
                    "globalInfluence": 0.75
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 8, "dependency": 0.12, "critical": false },
                        "norway": { "volume": 12, "dependency": 0.25, "critical": false },
                        "qatar": { "volume": 5, "dependency": 0.10, "critical": false }
                    },
                    "oil": {
                        "russia": { "volume": 12, "dependency": 0.18, "critical": false },
                        "norway": { "volume": 10, "dependency": 0.22, "critical": false },
                        "saudi_arabia": { "volume": 8, "dependency": 0.15, "critical": false }
                    }
                },
                "exports": {
                    "gas": {
                        "germany": { "volume": 25, "dependency": 0.15 },
                        "belgium": { "volume": 8, "dependency": 0.35 },
                        "france": { "volume": 5, "dependency": 0.11 }
                    },
                    "trade": {
                        "germany": { "volume": 120, "dependency": 0.45 },
                        "belgium": { "volume": 80, "dependency": 0.50 },
                        "france": { "volume": 60, "dependency": 0.20 }
                    }
                },
                "allies": ["germany", "belgium", "uk", "nato", "eu"],
                "rivals": [],
                "vulnerabilities": [
                    "Low-lying (sea level rise)",
                    "Groningen gas field depletion",
                    "Energy import dependency",
                    "Housing crisis"
                ],
                "strategicAssets": [
                    "Rotterdam port (Europe's largest)",
                    "Gas hub (TTF trading)",
                    "Financial center (Amsterdam)",
                    "Agriculture exports",
                    "Technology sector"
                ],
                "coordinates": { "lat": 52.1326, "lon": 5.2913 }
            },
            "belgium": {
                "name": "Belgium",
                "code": "BEL",
                "region": "europe",
                "population": 11.5,
                "gdp": 594,
                "metrics": {
                    "energySecurity": 0.42,
                    "economicHealth": 0.82,
                    "politicalStability": 0.78,
                    "militaryPower": 0.52,
                    "diplomaticInfluence": 0.72,
                    "globalInfluence": 0.70
                },
                "imports": {
                    "gas": {
                        "russia": { "volume": 4, "dependency": 0.35, "critical": false },
                        "norway": { "volume": 10, "dependency": 0.40, "critical": false },
                        "netherlands": { "volume": 8, "dependency": 0.35, "critical": false }
                    },
                    "oil": {
                        "russia": { "volume": 5, "dependency": 0.20, "critical": false },
                        "saudi_arabia": { "volume": 7, "dependency": 0.25, "critical": false },
                        "norway": { "volume": 6, "dependency": 0.22, "critical": false }
                    }
                },
                "exports": {
                    "trade": {
                        "germany": { "volume": 60, "dependency": 0.30 },
                        "france": { "volume": 60, "dependency": 0.25 },
                        "netherlands": { "volume": 80, "dependency": 0.50 }
                    }
                },
                "allies": ["france", "germany", "netherlands", "nato", "eu"],
                "rivals": [],
                "vulnerabilities": [
                    "Political fragmentation (Flemish-Walloon divide)",
                    "Energy imports",
                    "Public debt",
                    "Terrorism risk"
                ],
                "strategicAssets": [
                    "EU and NATO headquarters (Brussels)",
                    "Antwerp port",
                    "Diamond trade",
                    "Pharmaceutical industry",
                    "Central European location"
                ],
                "coordinates": { "lat": 50.5039, "lon": 4.4699 }
            }
        },
        "cascade_triggers": {
            "SANCTION_RUSSIA": {
                "name": "Sanction Russia",
                "description": "Western sanctions on Russian energy exports",
                "triggerCountry": "russia",
                "affectedRelationships": [
                    {
                        "from": "russia",
                        "to": "germany",
                        "type": "energy_gas",
                        "action": "severe",
                        "newStrength": 0.0,
                        "impactDescription": "Germany loses 55% of gas supply"
                    },
                    {
                        "from": "russia",
                        "to": "poland",
                        "type": "energy_gas",
                        "action": "severe",
                        "newStrength": 0.0,
                        "impactDescription": "Poland loses 48% of gas supply"
                    },
                    {
                        "from": "russia",
                        "to": "austria",
                        "type": "energy_gas",
                        "action": "critical",
                        "newStrength": 0.0,
                        "impactDescription": "Austria loses 80% of gas (EXTREME)"
                    },
                    {
                        "from": "russia",
                        "to": "hungary",
                        "type": "energy_gas",
                        "action": "critical",
                        "newStrength": 0.0,
                        "impactDescription": "Hungary loses 85% of gas (EXTREME)"
                    },
                    {
                        "from": "russia",
                        "to": "czech",
                        "type": "energy_gas",
                        "action": "severe",
                        "newStrength": 0.0,
                        "impactDescription": "Czech loses 66% of gas"
                    },
                    {
                        "from": "russia",
                        "to": "italy",
                        "type": "energy_gas",
                        "action": "moderate",
                        "newStrength": 0.0,
                        "impactDescription": "Italy loses 43% of gas"
                    },
                    {
                        "from": "russia",
                        "to": "germany",
                        "type": "energy_oil",
                        "action": "moderate",
                        "newStrength": 0.0,
                        "impactDescription": "Germany refineries affected"
                    },
                    {
                        "from": "russia",
                        "to": "poland",
                        "type": "energy_oil",
                        "action": "severe",
                        "newStrength": 0.0,
                        "impactDescription": "Poland loses 63% of oil"
                    }
                ],
                "cascadeEffects": [
                    {
                        "country": "germany",
                        "metrics": {
                            "energySecurity": -0.40,
                            "economicHealth": -0.25,
                            "politicalStability": -0.15
                        },
                        "description": "Chemical industry crashes, industrial production drops 30%"
                    },
                    {
                        "country": "poland",
                        "metrics": {
                            "energySecurity": -0.35,
                            "economicHealth": -0.20,
                            "transitRevenue": -2.0
                        },
                        "description": "Transit revenue lost, heating crisis"
                    },
                    {
                        "country": "austria",
                        "metrics": {
                            "energySecurity": -0.60,
                            "economicHealth": -0.35,
                            "politicalStability": -0.25
                        },
                        "description": "EXTREME crisis, no alternatives ready, industrial collapse"
                    },
                    {
                        "country": "hungary",
                        "metrics": {
                            "energySecurity": -0.65,
                            "economicHealth": -0.40,
                            "politicalStability": -0.30
                        },
                        "description": "EXTREME crisis, Orban government faces pressure"
                    },
                    {
                        "country": "italy",
                        "metrics": {
                            "energySecurity": -0.25,
                            "economicHealth": -0.15
                        },
                        "description": "Gas rationing, industrial slowdown"
                    },
                    {
                        "country": "turkey",
                        "metrics": {
                            "economicHealth": 0.10,
                            "globalInfluence": 0.15,
                            "transitRevenue": 3.0
                        },
                        "description": "Bosphorus leverage increases, transit fees surge"
                    },
                    {
                        "country": "qatar",
                        "metrics": {
                            "economicHealth": 0.25,
                            "globalInfluence": 0.20
                        },
                        "description": "LNG demand surges, Qatar becomes critical supplier"
                    },
                    {
                        "country": "norway",
                        "metrics": {
                            "economicHealth": 0.18,
                            "globalInfluence": 0.12
                        },
                        "description": "Alternative supplier, maxes out capacity"
                    },
                    {
                        "country": "azerbaijan",
                        "metrics": {
                            "economicHealth": 0.15,
                            "globalInfluence": 0.10
                        },
                        "description": "TAP pipeline at full capacity, new leverage"
                    },
                    {
                        "country": "kazakhstan",
                        "metrics": {
                            "economicHealth": 0.12,
                            "globalInfluence": 0.08
                        },
                        "description": "Alternative oil route, increased demand"
                    }
                ],
                "stabilityDrop": 0.35,
                "expectedCollapseTime": 8.5,
                "criticalThreshold": 0.70
            },
            "TURKEY_BLOCKS_BOSPHORUS": {
                "name": "Turkey Blocks Bosphorus",
                "description": "Turkey closes Bosphorus Strait to Russian oil tankers",
                "triggerCountry": "turkey",
                "affectedRelationships": [
                    {
                        "from": "russia",
                        "to": "world",
                        "type": "oil_transit",
                        "action": "critical",
                        "newStrength": 0.0,
                        "impactDescription": "3% of global oil supply blocked"
                    },
                    {
                        "from": "kazakhstan",
                        "to": "world",
                        "type": "oil_transit",
                        "action": "critical",
                        "newStrength": 0.0,
                        "impactDescription": "CPC pipeline exports blocked"
                    }
                ],
                "cascadeEffects": [
                    {
                        "country": "russia",
                        "metrics": {
                            "economicHealth": -0.45,
                            "globalInfluence": -0.25
                        },
                        "description": "Major oil export route cut, economic crisis"
                    },
                    {
                        "country": "kazakhstan",
                        "metrics": {
                            "economicHealth": -0.30,
                            "globalInfluence": -0.15
                        },
                        "description": "Export revenues crash"
                    },
                    {
                        "country": "turkey",
                        "metrics": {
                            "diplomaticInfluence": 0.30,
                            "globalInfluence": 0.25
                        },
                        "description": "Massive leverage over Russia, global importance surges"
                    },
                    {
                        "country": "world",
                        "metrics": {
                            "oilPrice": 0.15
                        },
                        "description": "Global oil prices spike 15%"
                    }
                ],
                "stabilityDrop": 0.25,
                "expectedCollapseTime": 6.5,
                "criticalThreshold": 0.70
            },
            "QATAR_LNG_SURGE": {
                "name": "Qatar LNG Emergency Supply",
                "description": "Qatar rapidly scales LNG exports to replace Russian gas",
                "triggerCountry": "qatar",
                "affectedRelationships": [
                    {
                        "from": "qatar",
                        "to": "germany",
                        "type": "energy_gas",
                        "action": "boost",
                        "newStrength": 0.70,
                        "impactDescription": "Qatar becomes Germany's primary supplier"
                    },
                    {
                        "from": "qatar",
                        "to": "italy",
                        "type": "energy_gas",
                        "action": "boost",
                        "newStrength": 0.65
                    },
                    {
                        "from": "qatar",
                        "to": "france",
                        "type": "energy_gas",
                        "action": "boost",
                        "newStrength": 0.55
                    }
                ],
                "cascadeEffects": [
                    {
                        "country": "qatar",
                        "metrics": {
                            "economicHealth": 0.35,
                            "diplomaticInfluence": 0.40,
                            "globalInfluence": 0.35
                        },
                        "description": "Qatar becomes energy kingmaker, massive leverage"
                    },
                    {
                        "country": "germany",
                        "metrics": {
                            "energySecurity": 0.20
                        },
                        "description": "Partial recovery via LNG terminals"
                    },
                    {
                        "country": "italy",
                        "metrics": {
                            "energySecurity": 0.15
                        },
                        "description": "Mediterranean LNG access stabilizes supply"
                    },
                    {
                        "country": "russia",
                        "metrics": {
                            "globalInfluence": -0.20
                        },
                        "description": "Permanent market share loss to Qatar"
                    }
                ],
                "stabilityDrop": -0.10,
                "expectedCollapseTime": 0,
                "criticalThreshold": 0.70
            }
        }
    }
};

export async function seedDatabase() {
    console.log('Starting seed process...');
    try {
        await realtimeDb.saveGeopoliticalData(geopoliticalData as any);
        console.log('Database seeded successfully!');
        return { success: true, message: 'Seeded successfully' };
    } catch (error) {
        console.error('Seeding failed:', error);
        return { success: false, message: 'Seeding failed', error };
    }
}
