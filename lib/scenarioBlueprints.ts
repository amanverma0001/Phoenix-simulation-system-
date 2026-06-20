/**
 * Scenario Blueprints
 * Specific mapping of Beneficiaries and Losers when a particular country is sanctioned.
 * Format: [sanctionedCountryId]: { winners: {id: reason}[], losers: {id: reason}[] }
 */

export interface SimulationRipple {
    id: string;
    reason: string;
}

export interface ScenarioBlueprint {
    winners: SimulationRipple[];
    losers: SimulationRipple[];
}

export const SCENARIO_BLUEPRINTS: Record<string, ScenarioBlueprint> = {
    afghanistan: {
        winners: [
            { id: 'pakistan', reason: 'Gain transit trade control' },
            { id: 'iran', reason: 'Gain transit trade control' },
            { id: 'uzbekistan', reason: 'Trade intermediary hub' }
        ],
        losers: [
            { id: 'pakistan', reason: 'Refugee burden & humanitarian instability' },
            { id: 'iran', reason: 'Border security & humanitarian costs' }
        ]
    },
    usa: {
        winners: [
            { id: 'china', reason: 'Financial and trade influence expansion' },
            { id: 'singapore', reason: 'Dollar alternative hub' },
            { id: 'uae', reason: 'Safe haven capital flight' },
            { id: 'saudi_arabia', reason: 'Energy price spike windfall' },
            { id: 'mexico', reason: 'Manufacturing replacement potential' },
            { id: 'vietnam', reason: 'Manufacturing replacement potential' }
        ],
        losers: [
            { id: 'canada', reason: 'Deeply tied supply chain collapse' },
            { id: 'mexico', reason: 'Deeply tied supply chain collapse' },
            { id: 'japan', reason: 'Security and trade shock' },
            { id: 'south_korea', reason: 'Trade and energy security shock' },
            { id: 'taiwan', reason: 'Trade and energy security shock' },
            { id: 'germany', reason: 'Major export market loss' }
        ]
    },
    china: {
        winners: [
            { id: 'india', reason: 'Manufacturing shift beneficiary' },
            { id: 'vietnam', reason: 'Manufacturing shift beneficiary' },
            { id: 'mexico', reason: 'Manufacturing shift beneficiary' },
            { id: 'australia', reason: 'Raw material exporter redirection' },
            { id: 'brazil', reason: 'Raw material exporter redirection' },
            { id: 'indonesia', reason: 'Manufacturing relocation hub' }
        ],
        losers: [
            { id: 'taiwan', reason: 'Systemic supply chain shock' },
            { id: 'south_korea', reason: 'Systemic supply chain shock' },
            { id: 'germany', reason: 'Auto & machinery export collapse' },
            { id: 'nigeria', reason: 'Loss of major commodity demand' },
            { id: 'angola', reason: 'Loss of major commodity demand' }
        ]
    },
    india: {
        winners: [
            { id: 'vietnam', reason: 'Textile/manufacturing shift' },
            { id: 'bangladesh', reason: 'Textile/manufacturing shift' },
            { id: 'china', reason: 'Fills pharma & industrial gaps' },
            { id: 'australia', reason: 'Resource export redirection' },
            { id: 'brazil', reason: 'Resource export redirection' }
        ],
        losers: [
            { id: 'nepal', reason: 'Extreme trade dependence failure' },
            { id: 'bhutan', reason: 'Extreme trade dependence failure' },
            { id: 'sri_lanka', reason: 'Tourism & trade spillover' },
            { id: 'maldives', reason: 'Tourism & trade spillover' },
            { id: 'uae', reason: 'Loss of major food buyer' },
            { id: 'saudi_arabia', reason: 'Loss of major food buyer' }
        ]
    },
    russia: {
        winners: [
            { id: 'india', reason: 'Buy discounted energy & rerouting' },
            { id: 'china', reason: 'Buy discounted energy & rerouting' },
            { id: 'turkey', reason: 'Sanctions-bypass trade hub' },
            { id: 'uae', reason: 'Trade rerouting & finance hub' },
            { id: 'usa', reason: 'Energy supply replacement' },
            { id: 'qatar', reason: 'Energy supply replacement' },
            { id: 'norway', reason: 'Energy supply replacement' }
        ],
        losers: [
            { id: 'germany', reason: 'Energy cost surge & industrial decoupling' },
            { id: 'poland', reason: 'Trade disruption & regional instability' },
            { id: 'kazakhstan', reason: 'Trade disruption exposure' }
        ]
    },
    uk: {
        winners: [
            { id: 'france', reason: 'Capital flight (London to Paris)' },
            { id: 'germany', reason: 'Capital flight (London to Frankfurt)' },
            { id: 'uae', reason: 'Financial business shift to Dubai' },
            { id: 'ireland', reason: 'Corporate relocation beneficiary' },
            { id: 'netherlands', reason: 'Trade rerouting hub' }
        ],
        losers: [
            { id: 'ireland', reason: 'Extreme trade exposure failure' },
            { id: 'india', reason: 'Commonwealth trade disruption' },
            { id: 'australia', reason: 'Commonwealth trade disruption' },
            { id: 'canada', reason: 'Commonwealth trade disruption' }
        ]
    },
    saudi_arabia: {
        winners: [
            { id: 'uae', reason: 'Oil supply replacement' },
            { id: 'qatar', reason: 'Energy market share gain' },
            { id: 'usa', reason: 'Oil supply replacement' },
            { id: 'norway', reason: 'Oil supply replacement' },
            { id: 'russia', reason: 'Oil price surge benefits' }
        ],
        losers: [
            { id: 'pakistan', reason: 'Loss of critical aid & remittances' },
            { id: 'egypt', reason: 'Loss of critical aid & trade' },
            { id: 'india', reason: 'Energy import cost spike' },
            { id: 'china', reason: 'Energy import cost spike' }
        ]
    },
    germany: {
        winners: [
            { id: 'poland', reason: 'Manufacturing shift beneficiary' },
            { id: 'czech', reason: 'Manufacturing shift beneficiary' },
            { id: 'china', reason: 'Machinery export replacement' },
            { id: 'usa', reason: 'Industrial equipment supplier gain' },
            { id: 'south_korea', reason: 'Industrial equipment supplier gain' }
        ],
        losers: [
            { id: 'austria', reason: 'Deeply integrated supply chain hit' },
            { id: 'hungary', reason: 'Auto sector integration failure' },
            { id: 'slovakia', reason: 'Auto sector integration failure' }
        ]
    },
    brazil: {
        winners: [
            { id: 'usa', reason: 'Agriculture export market share' },
            { id: 'argentina', reason: 'Agriculture export market share' },
            { id: 'australia', reason: 'Iron ore alternative supplier' },
            { id: 'canada', reason: 'Grain export replacement' }
        ],
        losers: [
            { id: 'china', reason: 'Soy & iron ore supply failure' },
            { id: 'egypt', reason: 'Food import cost surge' },
            { id: 'saudi_arabia', reason: 'Food import cost surge' }
        ]
    },
    south_africa: {
        winners: [
            { id: 'australia', reason: 'Minerals market share gain' },
            { id: 'russia', reason: 'Minerals market share gain' },
            { id: 'botswana', reason: 'Diamond trade redirection' }
        ],
        losers: [
            { id: 'namibia', reason: 'Regional economic spillover' },
            { id: 'zimbabwe', reason: 'Regional economic spillover' },
            { id: 'china', reason: 'Mineral import scarcity' }
        ]
    },
    australia: {
        winners: [
            { id: 'indonesia', reason: 'Coal & minerals replacement' },
            { id: 'canada', reason: 'Coal & minerals replacement' },
            { id: 'qatar', reason: 'LNG supply replacement' },
            { id: 'usa', reason: 'LNG supply replacement' }
        ],
        losers: [
            { id: 'china', reason: 'Critical resource shortage' },
            { id: 'japan', reason: 'Critical resource shortage' },
            { id: 'south_korea', reason: 'Critical resource shortage' },
            { id: 'fiji', reason: 'Pacific trade & aid collapse' }
        ]
    },
    france: {
        winners: [
            { id: 'germany', reason: 'EU industry market share' },
            { id: 'italy', reason: 'EU industry market share' },
            { id: 'usa', reason: 'Defense export redirection' },
            { id: 'spain', reason: 'Tourism redirection beneficiary' }
        ],
        losers: [
            { id: 'algeria', reason: 'Francophone trade & aid loss' },
            { id: 'morocco', reason: 'Francophone trade & aid loss' },
            { id: 'senegal', reason: 'Francophone trade & aid loss' },
            { id: 'ukraine', reason: 'Airbus supply chain disruption' }
        ]
    }
};
