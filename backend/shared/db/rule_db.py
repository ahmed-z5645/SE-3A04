class RuleDB:
    def __init__(self):
        self.rules = {}

    def add_rule(self, rule):
        self.rules[rule.rule_id] = rule
        return True

    def get_rules(self):
        return list(self.rules.values())

    def get_active_rules(self):
        return [r for r in self.rules.values() if r.active]