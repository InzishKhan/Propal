/**
 * Maps DB user fields to what EJS templates expect.
 */
const mapUserToTemplate = (user) => {
    if (!user) return null;
    return {
        ...user,
        user_id: user.id,
        manufacturer_id: user.id,
        consumer_id: user.id,
        company_name: user.companyName,
        contact_name: user.contactName,
        contact_email: user.contactEmail,
        contact_phone: user.contactPhone,
        website_url: user.websiteUrl,
        raw_materials: user.rawMaterials,
        is_premium: user.isPremium ? 1 : 0,
        subscription_type: user.subscriptionType
    };
};

module.exports = { mapUserToTemplate };
