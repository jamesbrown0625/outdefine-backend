import Ranking from 'src/libs/sequelize/ranking'

describe('ranking middify helper', () => {
    const mockProfile = {
        freelancer_id: 18,
        level_of_experience: 'Mid-level',
        roles_open_to: ['REMOTE', 'HYBRID'],
        skills: ['Vue', 'CSS'],
        years_of_experience: '1-3',
        hourly_rate: 95,
        role_name: 'Product Designer',
      }
      
      const mockJobItem = {
        id: 22,
        client_id: 108,
        company_id: 26,
        recruiter: null,
        recruitcrm_slug: null,
        company_name: 'Olive',
        job_title: 'Product Designer',
        status: 'ACTIVE',
        number_of_hires: '2',
        date_posted: '2023-01-04T17:32:50.104Z',
        date_last_activated: '2023-01-04T17:32:50.104Z',
        hourly_max_rate: 90,
        hourly_min_rate: 45,
        experience_level: 'Mid-level',
        location: 'REMOTE',
        term: 'FULL TIME',
        weekly_hours: null,
        description: 'lorem ipsum',
        looking_for_description: 'Lorem ipsum',
        duties: 'Lorem ipsum',
        skill_names:
          'CSS,HTML,OOP,Ruby,Web implementation,Software design,quality assurance,HTML,Mobile integration',
        primary_skills: '[2056,2055,2080,2077]',
        secondary_skills: '[2062,2081,2148,2055,2066]',
        visa_sponsor: false,
        timezone: 'PST',
        contactor_id: null,
        contact_email: null,
        company_number: null,
        website: null,
        benefits: null,
        actively_hiring: null,
        draft: false,
        createdAt: '2023-01-04T17:32:50.106Z',
        updatedAt: '2023-01-04T17:32:50.106Z',
        Company: {
          company_id: 26,
          recruitcrm_slug: null,
          name: 'Olive',
          website: 'https://www.outdefine.com/',
          industry: 'Web3',
          stage: 'Early stage',
          number_of_employees: '1-10',
          number_of_open_roles: '1-10',
          city: 'Los Angeles, CA, USA',
          country: 'United States',
          phone_number: '+19783502739',
          summary: 'olive is a olive oil company that sells home made olive oil',
          remote_first: true,
          logo: 'https://dev-outdefine-resume.s3.amazonaws.com/5bb6fafd-7f63-4e8c-a7b7-9d6b1c9afa68.png',
          logo_number: null,
          logo_type: false,
          banner: '0',
          banner_number: null,
          banner_type: false,
          createdAt: '2023-01-04T17:17:56.709Z',
          updatedAt: '2023-01-04T17:36:06.890Z',
          CompanySocialLink: {
            company_id: 26,
            linkedin_link: 'https://www.linkedin.com/company/outdefine',
            twitter_link: '',
            instagram_link: '',
            createdAt: '2023-01-04T17:18:04.913Z',
            updatedAt: '2023-01-04T17:36:06.880Z',
          },
        },
        ClientProfile: {
          client_id: 108,
          company_id: 26,
          recruitcrm_slug: null,
          position: 'Admin',
          onboarding_status: 'COMPLETED',
          type: null,
          summary: 'Hello my name is Karla Ulloa',
          date_invited: null,
          invited_by: null,
          createdAt: '2023-01-04T17:17:58.485Z',
          updatedAt: '2023-01-04T17:39:24.464Z',
          User: {
            user_id: 108,
            cognito_id: null,
            first_name: 'Karla',
            last_name: 'Ulloa',
            email_id: 'karla+client26@outdefine.com',
            contact_number: null,
            user_type: 'CLIENT',
            referral_link: null,
            referred_id: null,
            is_deleted: false,
            pronoun: 1,
            phone_number: null,
            dial_code: null,
            avatar: '6',
            avatar_number: null,
            avatar_type: false,
            banner: null,
            banner_number: null,
            banner_type: false,
            background_number: 1,
            createdAt: '2023-01-04T17:12:43.262Z',
            updatedAt: '2023-01-04T17:39:24.212Z',
          },
        },
      }
      

  test('ranking with mock profile, job objects', () => {
    const score = Ranking.getProfileSimilarity(mockProfile, mockJobItem)
    expect(score).toBeGreaterThan(0);
  })

  test('ranking with undefined objects', () => {
    const score = Ranking.getProfileSimilarity(undefined, undefined)
    expect(score).toBe(1);

  })
})
